"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase" // Declare the supabase variable

export function SessionMonitor() {
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    // Check session validity every 5 minutes
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error || !session) {
          // Handle session refresh or redirect here if needed
        }
      } catch (error) {
        console.error("Session check failed:", error)
        toast({
          title: "Session Expired",
          description: "Please refresh the page to continue",
          variant: "destructive",
        })
      }
    }

    const interval = setInterval(checkSession, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [user, toast])

  return null
}
