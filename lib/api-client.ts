import { supabase } from "./supabase"

class ApiClient {
  private async getAuthHeader() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token ? `Bearer ${session.access_token}` : null
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const authHeader = await this.getAuthHeader()

    if (!authHeader) {
      throw new Error("No authentication token available")
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || "Request failed")
    }

    return response.json()
  }

  // Projects
  async getProjects(params?: { status?: string; userId?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set("status", params.status)
    if (params?.userId) searchParams.set("userId", params.userId)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/projects${query ? `?${query}` : ""}`)
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`)
  }

  async createProject(data: any) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Events
  async getEvents(params?: { eventType?: string; status?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.eventType) searchParams.set("eventType", params.eventType)
    if (params?.status) searchParams.set("status", params.status)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/events${query ? `?${query}` : ""}`)
  }

  async createEvent(data: any) {
    return this.request("/events", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Admin
  async getUsers(params?: { search?: string; role?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set("search", params.search)
    if (params?.role) searchParams.set("role", params.role)

    const query = searchParams.toString()
    return this.request(`/admin/users${query ? `?${query}` : ""}`)
  }

  async getUser(id: string) {
    return this.request(`/admin/users/${id}`)
  }

  async createUser(data: any) {
    return this.request("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateUser(id: string, data: any) {
    return this.request(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getAdminStats() {
    return this.request("/admin/stats")
  }
}

export const apiClient = new ApiClient()
