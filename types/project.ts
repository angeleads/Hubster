export type ProjectDetails = {
  id: string;
  name: string;
  summary: string;
  status: string;
  student_id: string;
  functional_purpose: string[];
  material: string | null;
  programming_languages: string[];
  resources: string[];
  deliverables: any;
  total_estimated_days: number;
  total_xp: number;
  releases: any;
  screenshots: string[] | null;
  description: string | null;
  video_url: string | null;
  project_folder_url: string | null;
  admin_feedback: string | null;
  presentation_date: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
    tekx_position: string | null;
  } | null;
};
