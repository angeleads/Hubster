import * as XLSX from "xlsx"

export interface ExportableProject {
  id: string
  title: string
  description: string | null
  status: string
  user_id: string
  project_type: string | null
  github_url: string | null
  demo_url: string | null
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
}

export interface ExportableEvent {
  id: string
  title: string
  description: string | null
  event_type: string
  status: string
  user_id: string
  scheduled_date: string | null
  duration: number | null
  location: string | null
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
}

export function exportProjectsToExcel(projects: ExportableProject[], filename = "projects.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(
    projects.map((project) => ({
      "Project ID": project.id,
      Title: project.title,
      Description: project.description || "",
      Status: project.status,
      Type: project.project_type || "",
      "Student Name": project.user_name || "",
      "Student Email": project.user_email || "",
      "GitHub URL": project.github_url || "",
      "Demo URL": project.demo_url || "",
      "Created At": new Date(project.created_at).toLocaleDateString(),
      "Updated At": new Date(project.updated_at).toLocaleDateString(),
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects")

  XLSX.writeFile(workbook, filename)
}

export function exportEventsToExcel(events: ExportableEvent[], filename = "presentations.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(
    events.map((event) => ({
      "Event ID": event.id,
      Title: event.title,
      Description: event.description || "",
      Type: event.event_type,
      Status: event.status,
      "Student Name": event.user_name || "",
      "Student Email": event.user_email || "",
      "Scheduled Date": event.scheduled_date ? new Date(event.scheduled_date).toLocaleDateString() : "",
      "Duration (minutes)": event.duration || "",
      Location: event.location || "",
      "Created At": new Date(event.created_at).toLocaleDateString(),
      "Updated At": new Date(event.updated_at).toLocaleDateString(),
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Presentations")

  XLSX.writeFile(workbook, filename)
}
