"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useRouter } from "next/navigation"
import { ArrowLeft, Crown, Shield, User, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type AdminUser = {
  id: string
  email: string
  full_name: string
  role: "student" | "admin" | "super_admin"
  tekx_position: "Tek1" | "Tek2" | "Tek3" | "Tek4" | "Tek5" | null
  created_at: string
  updated_at: string
}

export default function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    role: "student", // Updated default value
    tekx_position: "", // Updated default value
  })

  // Unwrap params using React.use
  const unwrappedParams = React.use(params)

  // Redirect if not super admin
  const redirectIfNotSuperAdmin = () => {
    if (profile?.role !== "super_admin") {
      router.push("/dashboard")
    }
  }

  useEffect(() => {
    redirectIfNotSuperAdmin()
    fetchAdmin()
  }, [unwrappedParams.id])

  const fetchAdmin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", unwrappedParams.id).single()

      if (error) throw error

      setAdmin(data)
      setFormData({
        full_name: data.full_name,
        role: data.role,
        tekx_position: data.tekx_position || "",
      })
    } catch (err) {
      console.error("Error fetching admin:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch admin details")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data, error } = await supabase.rpc("update_admin_user", {
        p_user_id: (await params).id,
        p_full_name: formData.full_name,
        p_role: formData.role,
        p_tekx_position: formData.tekx_position || null,
      })

      if (error) throw error

      if (data?.success === false) {
        throw new Error(data.error)
      }

      toast({
        title: "Success",
        description: "Admin user updated successfully",
      })

      // Refresh the admin data
      await fetchAdmin()
    } catch (err) {
      console.error("Error updating admin:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update admin user",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="h-5 w-5 text-yellow-500" />
      case "admin":
        return <Shield className="h-5 w-5 text-purple-500" />
      default:
        return <User className="h-5 w-5 text-gray-500" />
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
          <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
            Admin
          </Badge>
        )
      default:
        return <Badge variant="secondary">Student</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !admin) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message={error || "Admin not found"} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard/super-admin/admin-management">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          {getRoleIcon(admin.role)}
          <div>
            <h1 className="text-3xl font-bold">{admin.full_name}</h1>
            <p className="text-muted-foreground">{admin.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
            <CardDescription>Current admin details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <div className="mt-1">{getRoleBadge(admin.role)}</div>
            </div>

            {admin.tekx_position && (
              <div>
                <Label className="text-sm font-medium">TekX Position</Label>
                <div className="mt-1">
                  <Badge variant="outline">{admin.tekx_position}</Badge>
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="text-sm text-muted-foreground mt-1">{new Date(admin.created_at).toLocaleDateString()}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-muted-foreground mt-1">{new Date(admin.updated_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Save className="h-5 w-5" />
              <span>Edit Admin</span>
            </CardTitle>
            <CardDescription>Update admin details and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={admin.email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tekx_position">TekX Position</Label>
                  <Select
                    value={formData.tekx_position}
                    onValueChange={(value) => handleInputChange("tekx_position", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select TekX position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Tek1">Tek1</SelectItem>
                      <SelectItem value="Tek2">Tek2</SelectItem>
                      <SelectItem value="Tek3">Tek3</SelectItem>
                      <SelectItem value="Tek4">Tek4</SelectItem>
                      <SelectItem value="Tek5">Tek5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard/super-admin/admin-management">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
