// hooks/useConnectionHealth.ts
"use client"

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export function useConnectionHealth() {
  const lastActivityRef = useRef<number>(Date.now())
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const performHealthCheck = async () => {
    try {
      // Simple health check query
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single()
      
      if (error && error.message?.toLowerCase().includes('failed to fetch')) {
        console.log('Connection health check failed, attempting to refresh connection...')
        // Force a new auth session check to refresh the connection
        await supabase.auth.getSession()
      }
    } catch (error) {
      console.warn('Health check failed:', error)
    }
  }

  useEffect(() => {
    // Update last activity on user interactions
    const updateActivity = () => {
      lastActivityRef.current = Date.now()
    }

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Perform health check every 2 minutes if there was recent activity
    healthCheckIntervalRef.current = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current
      const fiveMinutes = 5 * 60 * 1000

      // Only perform health check if user was active in the last 5 minutes
      if (timeSinceActivity < fiveMinutes) {
        performHealthCheck()
      }
    }, 2 * 60 * 1000) // Every 2 minutes

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity)
      })
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current)
      }
    }
  }, [])

  return { performHealthCheck }
}