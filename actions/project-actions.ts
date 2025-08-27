"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface ProjectData {
  id?: string
  user_id: string
  title: string
  description: string
  project_type: string
  functional_requirements: string[]
  technical_requirements: string[]
  material: string
  resources: string[]
  deliverables: any[] // Array of arrays: [title, details, days]
  releases: any[]
  timeline_estimate: string
  credits: number
  github_url?: string | null
  demo_url?: string | null
  file_attachments: string[]
  status: "draft" | "submitted" | "approved" | "rejected" | "in_progress" | "completed"
  likes_count: number
}

// Function to calculate credits based on days (1 credit per 5 days, rounded down)
export function calculateCredits(days: number): number {
  return Math.floor(days / 5)
}

// Convert deliverables to array of arrays format for database storage
export function formatDeliverablesForDB(deliverables: { functionality: string; details: string; days: number }[]) {
  return deliverables.map((d) => [d.functionality, d.details, d.days])
}

// Convert array of arrays format from database to form format
export function formatDeliverablesFromDB(
  deliverables: any[],
): { functionality: string; details: string; days: number }[] {
  if (!Array.isArray(deliverables)) return [{ functionality: "", details: "", days: 1 }]

  return deliverables.map((d, index) => {
    if (Array.isArray(d) && d.length >= 3) {
      return {
        functionality: d[0] || "",
        details: d[1] || "",
        days: Number(d[2]) || 1,
      }
    }
    // Fallback for old format
    if (typeof d === "object" && d.functionality) {
      return {
        functionality: d.functionality || "",
        details: d.details || "",
        days: Number(d.days) || 1,
      }
    }
    return { functionality: `Deliverable ${index + 1}`, details: "", days: 1 }
  })
}

// Create a new project
export async function createProject(formData: any) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    const credits = calculateCredits(formData.totalEstimatedDays || 0)

    const projectData: Omit<ProjectData, "id"> = {
      user_id: user.id,
      title: formData.name,
      description: formData.description || "",
      project_type: "student_project",
      functional_requirements: formData.functionalPurpose?.filter((req: string) => req.trim() !== "") || [],
      technical_requirements: formData.programmingLanguages?.filter((req: string) => req.trim() !== "") || [],
      material: formData.material || "",
      resources: formData.resources?.filter((req: string) => req.trim() !== "") || [],
      deliverables: formatDeliverablesForDB(formData.deliverables || []),
      releases: formData.releases || [],
      timeline_estimate: `${formData.totalEstimatedDays || 0} days`,
      credits,
      github_url: formData.projectFolderUrl || null,
      demo_url: formData.videoUrl || null,
      file_attachments: [],
      status: "draft",
      likes_count: 0,
    }

    const { data, error } = await supabase.from("projects").insert(projectData).select().single()

    if (error) throw error

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/my-projects")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Update an existing project
export async function updateProject(projectId: string, formData: any) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    const credits = calculateCredits(formData.totalEstimatedDays || 0)

    const projectData = {
      title: formData.name,
      description: formData.description || "",
      functional_requirements: formData.functionalPurpose?.filter((req: string) => req.trim() !== "") || [],
      technical_requirements: formData.programmingLanguages?.filter((req: string) => req.trim() !== "") || [],
      material: formData.material || "",
      resources: formData.resources?.filter((req: string) => req.trim() !== "") || [],
      deliverables: formatDeliverablesForDB(formData.deliverables || []),
      releases: formData.releases || [],
      timeline_estimate: `${formData.totalEstimatedDays || 0} days`,
      credits,
      github_url: formData.projectFolderUrl || null,
      demo_url: formData.videoUrl || null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", projectId)
      .eq("user_id", user.id) // Ensure user owns the project
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/my-projects")
    revalidatePath(`/dashboard/projects/${projectId}`)

    return { success: true, data }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Submit a project for review
export async function submitProject(projectId: string, formData: any) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    const credits = calculateCredits(formData.totalEstimatedDays || 0)

    const projectData = {
      title: formData.name,
      description: formData.description || "",
      functional_requirements: formData.functionalPurpose?.filter((req: string) => req.trim() !== "") || [],
      technical_requirements: formData.programmingLanguages?.filter((req: string) => req.trim() !== "") || [],
      material: formData.material || "",
      resources: formData.resources?.filter((req: string) => req.trim() !== "") || [],
      deliverables: formatDeliverablesForDB(formData.deliverables || []),
      releases: formData.releases || [],
      timeline_estimate: `${formData.totalEstimatedDays || 0} days`,
      credits,
      github_url: formData.projectFolderUrl || null,
      demo_url: formData.videoUrl || null,
      status: "submitted" as const,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", projectId)
      .eq("user_id", user.id) // Ensure user owns the project
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/my-projects")
    revalidatePath("/dashboard/admin/projects")
    revalidatePath(`/dashboard/projects/${projectId}`)

    return { success: true, data }
  } catch (error) {
    console.error("Error submitting project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Admin actions for project status management
export async function updateProjectStatus(projectId: string, status: ProjectData["status"], adminNote?: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if user is admin or super_admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      throw new Error("Unauthorized: Admin access required")
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    // Set appropriate timestamps based on status
    if (status === "completed") {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase.from("projects").update(updateData).eq("id", projectId).select().single()

    if (error) throw error

    // Add admin feedback if provided
    if (adminNote) {
      await supabase.from("project_feedback").insert({
        project_id: projectId,
        user_id: user.id,
        feedback: adminNote,
        feedback_type: "admin_review",
      })
    }

    revalidatePath("/dashboard/admin/projects")
    revalidatePath(`/dashboard/projects/${projectId}`)

    return { success: true, data }
  } catch (error) {
    console.error("Error updating project status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Get project by ID with user permission check
export async function getProject(projectId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        profiles:user_id (
          full_name,
          email,
          role
        )
      `)
      .eq("id", projectId)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Get user's projects
export async function getUserProjects() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user projects:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Delete project (only by owner)
export async function deleteProject(projectId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", user.id) // Ensure user owns the project

    if (error) throw error

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/my-projects")

    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
