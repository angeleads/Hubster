"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useProjects(params?: { status?: string; userId?: string; limit?: number }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getProjects(params)
        setData(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useProject(id: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getProject(id)
        setData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project")
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useEvents(params?: { eventType?: string; status?: string; limit?: number }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getEvents(params)
        setData(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useAdminUsers(params?: { search?: string; role?: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getUsers(params)
        setData(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useAdminStats() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getAdminStats()
        setData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch admin stats")
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}
