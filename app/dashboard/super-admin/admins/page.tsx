"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Shield, UserPlus, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"

type AdminUser = {
  id: string
  email: string
  full_name: string
  role: "student" | "admin" | "super_admin"
  tekx_position: string | null
  created_at: string
  updated_at: string
}

export default function ManageAdminsPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "admin" as "admin" | "super_admin",
    tekxPosition: "",
  })

  useEffect(() => {
    if (profile) {
      if (profile.role !== "super_admin") {
        router.push("/dashboard")
        return
      }
      fetchAdmins()
    }
  }, [profile, router])

  const fetchAdmins = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["admin", "super_admin"])
        .order("created_at", { ascending: false })

      if (error) throw error

      setAdmins(data || [])
    } catch (error: any) {
      console.error("Error fetching admins:", error)
      setError("Failed to load admin users. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingAdmin) {
        // Update existing admin
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.fullName,
            role: formData.role,
            tekx_position: formData.tekxPosition || null,
          })
          .eq("id", editingAdmin.id)

        if (error) throw error

        toast({
          title: "Admin Updated",
          description: "Admin user has been updated successfully",
        })
      } else {
        // Create new admin - Note: This would typically require server-side user creation
        toast({
          title: "Feature Not Available",
          description: "Creating new admin users requires server-side implementation",
          variant: "destructive",
        })
        return
      }

      setIsDialogOpen(false)
      setEditingAdmin(null)
      setFormData({ email: "", fullName: "", role: "admin", tekxPosition: "" })
      fetchAdmins()
    } catch (error: any) {
      console.error("Error saving admin:", error)
      toast({
        title: "Error",
        description: "Failed to save admin user",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin)
    setFormData({
      email: admin.email,
      fullName: admin.full_name,
      role: admin.role,
      tekxPosition: admin.tekx_position || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to remove this admin? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("profiles").update({ role: "student" }).eq("id", adminId)

      if (error) throw error

      toast({
        title: "Admin Removed",
        description: "Admin privileges have been revoked",
      })

      fetchAdmins()
    } catch (error: any) {
      console.error("Error removing admin:", error)
      toast({
        title: "Error",
        description: "Failed to remove admin privileges",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading admin users..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAdmins} />
  }

  if (!profile || profile.role !== "super_admin") {
    return <LoadingSpinner message="Checking permissions..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white flex items-center mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Admins</h2>
            <p className="text-slate-400">Manage administrator accounts and permissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingAdmin(null)
                  setFormData({ email: "", fullName: "", role: "admin", tekxPosition: "" })
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">{editingAdmin ? "Edit Admin" : "Add New Admin"}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingAdmin ? "Update admin user details" : "Create a new administrator account"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={!!editingAdmin}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">
                    Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "super_admin") =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tekxPosition" className="text-white">
                    TekX Position (Optional)
                  </Label>
                  <Input
                    id="tekxPosition"
                    value={formData.tekxPosition}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tekxPosition: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    {editingAdmin ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Admin Users ({admins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {admins.length > 0 ? (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{admin.full_name}</h3>
                      <p className="text-sm text-slate-400">{admin.email}</p>
                      {admin.tekx_position && <p className="text-xs text-slate-500">{admin.tekx_position}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={
                        admin.role === "super_admin"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }
                    >
                      {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(admin)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {admin.id !== profile.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(admin.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-12 w-12 text-slate-500 mx-auto" />}
              title="No admin users found"
              description="No administrator accounts have been created yet"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
