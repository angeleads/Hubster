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
  session: Session | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, tekxPosition?: string) => Promise<void>
  signOut: () => Promise<void>
  supabase: typeof supabase
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
    if (error) console.error("Profile fetch error:", error)
    setProfile(data ?? null)
  }

  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) fetchProfile(data.session.user.id)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // Auto refresh every 10 min
    const interval = setInterval(() => {
      supabase.auth.refreshSession().catch(() => {})
    }, 10 * 60 * 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
      mounted.current = false
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string, tekxPosition?: string) => {
    await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, tekx_position: tekxPosition ?? null } },
    })
  }

  const signIn = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        refreshProfile,
        signIn,
        signUp,
        signOut,
        supabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}
