"use server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function saveProjectDraft(formData: any, projectId?: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const allCookies = await cookieStore.getAll();
          return allCookies.map(cookie => ({ name: cookie.name, value: cookie.value }));
        },
        async setAll(cookiesToSet: { name: string; value: string }[]) {
          for (const cookie of cookiesToSet) {
            await cookieStore.set(cookie.name, cookie.value);
          }
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const projectData = {
    student_id: user.id,
    name: formData.name,
    summary: formData.summary,
    functional_purpose: formData.functionalPurpose,
    material: formData.material || null,
    programming_languages: formData.programmingLanguages,
    resources: formData.resources,
    deliverables: formData.deliverables,
    total_estimated_days: formData.totalEstimatedDays,
    releases: formData.releases,
    screenshots: formData.screenshots || [],
    description: formData.description || null,
    video_url: formData.videoUrl || null,
    project_folder_url: formData.projectFolderUrl || null,
    status: "draft",
  }

  if (projectId) {
    const { data, error } = await supabase.from("projects").update(projectData).eq("id", projectId).select().single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase.from("projects").insert(projectData).select().single()

    if (error) throw error
    return data
  }
}

export async function submitProject(formData: any, projectId?: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const allCookies = await cookieStore.getAll();
          return allCookies.map(cookie => ({ name: cookie.name, value: cookie.value }));
        },
        async setAll(cookiesToSet: { name: string; value: string }[]) {
          for (const cookie of cookiesToSet) {
            await cookieStore.set(cookie.name, cookie.value);
          }
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const projectData = {
    student_id: user.id,
    name: formData.name,
    summary: formData.summary,
    functional_purpose: formData.functionalPurpose,
    material: formData.material || null,
    programming_languages: formData.programmingLanguages,
    resources: formData.resources,
    deliverables: formData.deliverables,
    total_estimated_days: formData.totalEstimatedDays,
    releases: formData.releases,
    screenshots: formData.screenshots || [],
    description: formData.description || null,
    video_url: formData.videoUrl || null,
    project_folder_url: formData.projectFolderUrl || null,
    status: "submitted",
  }

  if (projectId) {
    const { data, error } = await supabase.from("projects").update(projectData).eq("id", projectId).select().single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase.from("projects").insert(projectData).select().single()

    if (error) throw error
    return data
  }
}
