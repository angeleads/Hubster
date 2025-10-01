"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type Profile = {
  id: string
  email: string
  full_name: string
  role: "student" | "admin" | "super_admin"
  tekx_position: "Tek1" | "Tek2" | "Tek3" | "Tek4" | "Tek5" | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, tekxPosition?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)
  const fetchingProfile = useRef(false)

  const fetchProfile = async (userId: string, retryCount = 0): Promise<void> => {
    if (fetchingProfile.current || !mounted.current) return
    fetchingProfile.current = true

    try {

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

      if (error) {
        console.error("Profile fetch error:", error)
        if (retryCount < 3) {
          setTimeout(
            () => {
              if (mounted.current) {
                fetchingProfile.current = false
                fetchProfile(userId, retryCount + 1)
              }
            },
            1000 * (retryCount + 1),
          )
          return
        }
        throw error
      }

      if (!data) {

        if (retryCount < 2) {
          try {
            const { data: userData } = await supabase.auth.getUser()
            if (userData.user && mounted.current) {
              const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({
                  id: userId,
                  email: userData.user.email || "",
                  full_name: userData.user.user_metadata?.full_name || userData.user.email?.split("@")[0] || "",
                  role: "student",
                  tekx_position: userData.user.user_metadata?.tekx_position || null,
                })
                .select()
                .single()

              if (createError) {
                console.error("Failed to create profile manually:", createError)
                if (mounted.current) {
                  setProfile(null)
                }
                return
              }

              if (mounted.current) {
                setProfile(newProfile)
              }
            }
          } catch (createError) {
            console.error("Failed to create profile manually:", createError)
            if (mounted.current) {
              setProfile(null)
            }
          }
        }
        return
      }

      if (mounted.current) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
      if (mounted.current) {
        setProfile(null)
      }
    } finally {
      fetchingProfile.current = false
    }
  }

  const refreshProfile = async () => {
    if (user && mounted.current) {
      await fetchProfile(user.id)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, tekxPosition?: string) => {
    try {
      const validTekxPositions = ["Tek1", "Tek2", "Tek3", "Tek4", "Tek5"];
      const validatedTekxPosition =
        tekxPosition && validTekxPositions.includes(tekxPosition) ? tekxPosition : null;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            tekx_position: validatedTekxPosition,
          },
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      if (mounted.current) {
        setUser(null)
        setProfile(null)
        setSession(null)
      }
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  useEffect(() => {
    mounted.current = true

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          return
        }

        if (mounted.current) {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
      } finally {
        if (mounted.current) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (mounted.current) {
        setSession(session)
        setUser(session?.user ?? null)

        if (event === "SIGNED_IN" && session?.user) {
          console.log("User signed in")
          await fetchProfile(session.user.id)
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out")
          setProfile(null)
        }

        setLoading(false)
      }
    })

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
