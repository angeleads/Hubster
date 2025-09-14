import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: "student" | "admin" | "super_admin"
          tekx_position: "Tek1" | "Tek2" | "Tek3" | "Tek4" | "Tek5" | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: "student" | "admin" | "super_admin"
          tekx_position?: "Tek1" | "Tek2" | "Tek3" | "Tek4" | "Tek5" | null
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          email?: string
          full_name?: string
          role?: "student" | "admin" | "super_admin"
          tekx_position?: "Tek1" | "Tek2" | "Tek3" | "Tek4" | "Tek5" | null
          avatar_url?: string | null
          bio?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          student_id: string
          title: string
          description: string | null
          status: "draft" | "submitted" | "approved" | "rejected" | "in_progress" | "completed"
          project_type: string
          functional_requirements: string[] | null
          technical_requirements: string[] | null
          deliverables: string[] | null
          timeline_estimate: string | null
          github_url: string | null
          demo_url: string | null
          file_attachments: string[] | null
          likes_count: number
          created_at: string
          updated_at: string
          submitted_at: string | null
          completed_at: string | null
          functional_purpose: any
          material: string | null
          programming_languages: any
          resources: any
          total_estimated_days: number
          releases: any
          screenshots: any
          video_url: string | null
          project_folder_url: string | null
        }
        Insert: {
          user_id: string
          student_id: string
          title: string
          description?: string | null
          status?: "draft" | "submitted" | "approved" | "rejected" | "in_progress" | "completed"
          project_type?: string
          functional_requirements?: string[] | null
          technical_requirements?: string[] | null
          deliverables?: string[] | null
          timeline_estimate?: string | null
          github_url?: string | null
          demo_url?: string | null
          file_attachments?: string[] | null
          likes_count?: number
          submitted_at?: string | null
          completed_at?: string | null
          functional_purpose?: any
          material?: string | null
          programming_languages?: any
          resources?: any
          total_estimated_days?: number
          releases?: any
          screenshots?: any
          video_url?: string | null
          project_folder_url?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          status?: "draft" | "submitted" | "approved" | "rejected" | "in_progress" | "completed"
          project_type?: string
          functional_requirements?: string[] | null
          technical_requirements?: string[] | null
          deliverables?: string[] | null
          timeline_estimate?: string | null
          github_url?: string | null
          demo_url?: string | null
          file_attachments?: string[] | null
          likes_count?: number
          submitted_at?: string | null
          completed_at?: string | null
          functional_purpose?: any
          material?: string | null
          programming_languages?: any
          resources?: any
          total_estimated_days?: number
          releases?: any
          screenshots?: any
          video_url?: string | null
          project_folder_url?: string | null
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          presenter_id: string
          title: string
          description: string | null
          event_type: "talk" | "workshop" | "conference" | "hackathon"
          status: "pending" | "approved" | "rejected" | "completed"
          preferred_date: string | null
          start_date: string
          end_date: string
          duration_minutes: number
          location: string | null
          presentation_files: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          presenter_id: string
          title: string
          description?: string | null
          event_type?: "talk" | "workshop" | "conference" | "hackathon"
          status?: "pending" | "approved" | "rejected" | "completed"
          preferred_date?: string | null
          start_date?: string
          end_date?: string
          duration_minutes?: number
          location?: string | null
          presentation_files?: string[] | null
        }
        Update: {
          title?: string
          description?: string | null
          event_type?: "talk" | "workshop" | "conference" | "hackathon"
          status?: "pending" | "approved" | "rejected" | "completed"
          preferred_date?: string | null
          start_date?: string
          end_date?: string
          duration_minutes?: number
          location?: string | null
          presentation_files?: string[] | null
        }
      }
      project_feedback: {
        Row: {
          id: string
          project_id: string
          sender_id: string
          message: string
          created_at: string
        }
        Insert: {
          project_id: string
          sender_id: string
          message: string
        }
        Update: {
          message?: string
        }
      }
      project_likes: {
        Row: {
          id: string
          project_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          project_id: string
          user_id: string
        }
        Update: {}
      }
      event_feedback: {
        Row: {
          id: string
          event_id: string
          sender_id: string
          message: string
          rating: number | null
          created_at: string
        }
        Insert: {
          event_id: string
          sender_id: string
          message: string
          rating?: number | null
        }
        Update: {
          message?: string
          rating?: number | null
        }
      }
    }
  }
}


