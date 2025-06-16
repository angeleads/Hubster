"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type Profile = {
  id: string
  email: string
  full_name: string
  role: "student" | "admin"
  tekx_position: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, tekxPosition?: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId)

      // Use a more direct approach to avoid RLS recursion
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle() // Use maybeSingle to avoid errors when no profile exists

      if (error) {
        console.log("Profile fetch error:", error)

        // If profile doesn't exist, create it
        if (error.code === "PGRST116" || !data) {
          console.log("Profile not found, creating new profile...")
          return await createProfile(userId)
        } else {
          throw error
        }
      }

      if (!data) {
        console.log("No profile data, creating new profile...")
        return await createProfile(userId)
      }

      console.log("Profile fetched successfully:", data)
      setProfile(data)
      return data
    } catch (error) {
      console.error("Error in fetchProfile:", error)

      // Try to create profile as fallback
      try {
        return await createProfile(userId)
      } catch (createError) {
        console.error("Failed to create profile:", createError)
        setProfile(null)
        return null
      }
    }
  }, [])

  const createProfile = async (userId: string) => {
    try {
      console.log("Creating profile for user:", userId)

      // Get the current user's auth data
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error("No authenticated user found")
      }

      const email = userData.user.email || "unknown@example.com"
      const fullName = userData.user.user_metadata?.full_name || email.split("@")[0] || "Unknown User"

      const profileData = {
        id: userId,
        email: email,
        full_name: fullName,
        role: "student" as const,
        tekx_position: userData.user.user_metadata?.tekx_position || null,
      }

      console.log("Creating profile with data:", profileData)

      // Use upsert to handle conflicts
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "id",
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating profile:", createError)

        // If creation fails, return a default profile
        const defaultProfile = {
          id: userId,
          email: email,
          full_name: fullName,
          role: "student" as const,
          tekx_position: userData.user.user_metadata?.tekx_position || null,
        }

        setProfile(defaultProfile)
        return defaultProfile
      }

      console.log("Successfully created profile:", newProfile)
      setProfile(newProfile)
      return newProfile
    } catch (error) {
      console.error("Error in createProfile:", error)

      // Return a fallback profile
      const fallbackProfile = {
        id: userId,
        email: "unknown@example.com",
        full_name: "Unknown User",
        role: "student" as const,
        tekx_position: null,
      }

      setProfile(fallbackProfile)
      return fallbackProfile
    }
  }

  const refreshSession = useCallback(async () => {
    try {
      console.log("Refreshing session...")
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing session:", error)
        // If refresh fails, sign out the user
        await signOut()
        return
      }

      if (data.session?.user) {
        console.log("Session refreshed successfully")
        setUser(data.session.user)
        await fetchProfile(data.session.user.id)
      } else {
        console.log("No session after refresh")
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
      await signOut()
    }
  }, [fetchProfile])

  useEffect(() => {
    let mounted = true
    let refreshTimer: NodeJS.Timeout

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        console.log("Initial session:", session ? "exists" : "null")

        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            console.log("User found in session:", session.user.id)
            await fetchProfile(session.user.id)
          } else {
            console.log("No user in session")
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("Auth state changed:", event, session?.user?.id || "no user")

      if (event === "SIGNED_OUT" || !session) {
        console.log("User signed out or no session")
        setUser(null)
        setProfile(null)
        setLoading(false)
        if (refreshTimer) {
          clearInterval(refreshTimer)
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("User signed in or token refreshed")
        setUser(session.user)
        if (session.user) {
          await fetchProfile(session.user.id)
        }
        setLoading(false)
      } else if (event === "USER_UPDATED") {
        console.log("User updated")
        setUser(session.user)
        setLoading(false)
      }
    })

    // Set up automatic token refresh every 50 minutes (tokens expire after 1 hour)
    const setupTokenRefresh = () => {
      if (refreshTimer) {
        clearInterval(refreshTimer)
      }

      refreshTimer = setInterval(
        async () => {
          console.log("Auto-refreshing session...")
          await refreshSession()
        },
        50 * 60 * 1000,
      ) // 50 minutes
    }

    // Start token refresh if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log("Setting up token refresh for logged in user")
        setupTokenRefresh()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      if (refreshTimer) {
        clearInterval(refreshTimer)
      }
    }
  }, [fetchProfile, refreshSession])

  // Set up activity detection to refresh session on user interaction
  useEffect(() => {
    let activityTimer: NodeJS.Timeout

    const resetActivityTimer = () => {
      if (activityTimer) {
        clearTimeout(activityTimer)
      }

      // If user is inactive for 30 minutes, refresh the session
      activityTimer = setTimeout(
        async () => {
          if (user) {
            console.log("Refreshing session due to activity...")
            await refreshSession()
          }
        },
        30 * 60 * 1000,
      ) // 30 minutes
    }

    const handleActivity = () => {
      resetActivityTimer()
    }

    // Listen for user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Start the timer
    if (user) {
      resetActivityTimer()
    }

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (activityTimer) {
        clearTimeout(activityTimer)
      }
    }
  }, [user, refreshSession])

  const signIn = async (email: string, password: string) => {
    console.log("Attempting to sign in...")
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("Sign in error:", error)
      throw error
    }
    console.log("Sign in successful")
  }

  const signUp = async (email: string, password: string, fullName: string, tekxPosition?: string) => {
    console.log("Attempting to sign up...")
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          tekx_position: tekxPosition || null,
        },
      },
    })
    if (error) {
      console.error("Sign up error:", error)
      throw error
    }
    console.log("Sign up successful")
  }

  const signOut = async () => {
    console.log("Signing out...")
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
      throw error
    }
    setUser(null)
    setProfile(null)
    console.log("Sign out successful")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
