"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { Crown, Shield, User, Plus, Search, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type AdminUser = {
  id: string
  email: string
  full_name: string
  role: "student" | "admin" | "super_admin"
  tekx_position: "Tek1" | "Tek2" | "Tek3" | "Tek4" | "Tek5" | null
  created_at: string
  updated_at: string
}

type AdminStats = {
  total_admins: number
  total_super_admins: number
  total_students: number
  recent_admins: number
  total_users: number
}

export default function AdminManagementPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  // Redirect if not super admin
  useEffect(() => {
    if (profile && profile.role !== "super_admin") {
      router.push("/dashboard")
    }
  }, [profile, router])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all users (we'll handle role-based access in the application)
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setAdmins(data || [])
    } catch (err) {
      console.error("Error fetching admins:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch admins")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc("get_admin_stats")

      if (error) throw error

      if (data?.success === false) {
        throw new Error(data.error)
      }

      setStats(data)
    } catch (err) {
      console.error("Error fetching stats:", err)
      // Don't set error state for stats, just log it
    }
  }

  useEffect(() => {
    if (profile?.role === "super_admin") {
      fetchAdmins()
      fetchStats()
    }
  }, [profile])

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || admin.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
            Super Admin
          </Badge>
        )
      case "admin":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            Admin
          </Badge>
        )
      default:
        return <Badge variant="secondary">Student</Badge>
    }
  }

  if (profile?.role !== "super_admin") {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message="Access denied. Super admin privileges required." />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_admins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_super_admins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Admins</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent_admins}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Admin List */}
      {filteredAdmins.length === 0 ? (
        <EmptyState icon={<Users />} title="No users found" description="No users match your search criteria." />
      ) : (
        <div className="grid gap-6">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(admin.role)}
                      <div>
                        <h3 className="font-semibold">{admin.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {getRoleBadge(admin.role)}
                      {admin.tekx_position && (
                        <Badge variant="outline" className="ml-2">
                          {admin.tekx_position}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/super-admin/admin-management/${admin.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
