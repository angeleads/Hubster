import { createClient } from "@supabase/supabase-js";

// Temporary hard-coded values for testing
const supabaseUrl = "https://dfgeaflinnpovrqubupk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZ2VhZmxpbm5wb3ZycXVidXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc0MTgsImV4cCI6MjA2MjI5MzQxOH0.NLjJ6oGYBh1WMDJgc8vIS7dqYoBJHqDACeOCXrlvTKg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "student" | "admin";
          tekx_position: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: "student" | "admin";
          tekx_position?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: "student" | "admin";
          tekx_position?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          student_id: string;
          name: string;
          summary: string;
          functional_purpose: string[];
          material: string | null;
          programming_languages: string[];
          resources: string[];
          deliverables: any;
          total_estimated_days: number;
          total_credit: number;
          releases: any;
          screenshots: string[] | null;
          description: string | null;
          video_url: string | null;
          project_folder_url: string | null;
          status:
            | "draft"
            | "submitted"
            | "approved"
            | "rejected"
            | "in_progress"
            | "completed";
          admin_feedback: string | null;
          presentation_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          name: string;
          summary: string;
          functional_purpose: string[];
          material?: string | null;
          programming_languages: string[];
          resources: string[];
          deliverables: any;
          total_estimated_days: number;
          releases: any;
          screenshots?: string[] | null;
          description?: string | null;
          video_url?: string | null;
          project_folder_url?: string | null;
          status?:
            | "draft"
            | "submitted"
            | "approved"
            | "rejected"
            | "in_progress"
            | "completed";
        };
        Update: {
          name?: string;
          summary?: string;
          functional_purpose?: string[];
          material?: string | null;
          programming_languages?: string[];
          resources?: string[];
          deliverables?: any;
          total_estimated_days?: number;
          total_xp?: number;
          releases?: any;
          screenshots?: string[] | null;
          description?: string | null;
          video_url?: string | null;
          project_folder_url?: string | null;
          status?:
            | "draft"
            | "submitted"
            | "approved"
            | "rejected"
            | "in_progress"
            | "completed";
          admin_feedback?: string | null;
          presentation_date?: string | null;
        };
      };
    };
  };
};
