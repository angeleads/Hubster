"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import {
  ProjectFormProvider,
  ProjectFormData,
} from "@/components/project/project-form/form-context";
import { ProjectForm } from "@/components/project/project-form/project-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<
    Partial<ProjectFormData> | undefined
  >(undefined);

  const projectId = params.id as string;

  // Convert array of arrays format from database to form format
  const formatDeliverablesFromDB = (
    deliverables: any[]
  ): { functionality: string; details: string; days: number }[] => {
    if (!Array.isArray(deliverables))
      return [{ functionality: "", details: "", days: 1 }];

    return deliverables.map((d, index) => {
      if (Array.isArray(d) && d.length >= 3) {
        return {
          functionality: d[0] || "",
          details: d[1] || "",
          days: Number(d[2]) || 1,
        };
      }
      // Fallback for old format
      if (typeof d === "object" && d.functionality) {
        return {
          functionality: d.functionality || "",
          details: d.details || "",
          days: Number(d.days) || 1,
        };
      }
      return {
        functionality: `Deliverable ${index + 1}`,
        details: "",
        days: 1,
      };
    });
  };

  useEffect(() => {
    if (projectId && user) {
      fetchProject();
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;

      // Check if user owns the project
      if (data.user_id !== user?.id) {
        setError("You don't have permission to edit this project");
        return;
      }

      // Check if project can be edited (only draft and rejected projects)
      if (!["draft", "rejected", "submitted", "completed"].includes(data.status)) {
        setError("This project cannot be edited in its current status");
        return;
      }

      setProject(data);

      // Convert database data to form format
      const timelineDays = Number.parseInt(
        data.timeline_estimate?.replace(" days", "") || "0"
      );
      const formattedDeliverables = formatDeliverablesFromDB(
        data.deliverables || []
      );

      const formData: Partial<ProjectFormData> = {
        name: data.title || "",
        summary: data.description || "",
        leaders: [{ name: "", tekx: "", position: "" }],
        functionalPurpose: data.functional_requirements || [""],
        material: data.material,
        programmingLanguages: data.technical_requirements || [""],
        resources: data.resources,
        deliverables: formattedDeliverables,
        totalEstimatedDays: timelineDays,
        totalCredits: data.credits || Math.floor(timelineDays / 5),
        releases: [
          { version: "1.0", features: [""] },
          { version: "2.0", features: [""] },
          { version: "3.0", features: [""] },
          { version: "4.0", features: [""] },
        ],
        screenshots: [],
        description: data.description || "",
        videoUrl: data.demo_url || "",
        projectFolderUrl: data.github_url || "",
      };

      setInitialData(formData);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project data");
    } finally {
      setIsLoading(false);
    }
  };

  function mapProjectToFormData(project: any): Partial<ProjectFormData> {
    return {
      name: project.title || "",
      description: project.description || "",
      material: project.material || "",
      // Map database fields to form fields
      functionalPurpose: Array.isArray(project.functional_requirements)
        ? project.functional_requirements.length > 0
          ? project.functional_requirements
          : [""]
        : [""],
      programmingLanguages: Array.isArray(project.technical_requirements)
        ? project.technical_requirements.length > 0
          ? project.technical_requirements
          : [""]
        : [""],
      resources: Array.isArray(project.resources)
        ? project.resources.length > 0
          ? project.resources
          : [""]
        : [""],
      videoUrl: project.demo_url || "",
      projectFolderUrl: project.github_url || "",
      // Add other field mappings as needed
      deliverables: formatDeliverablesFromDB(project.deliverables || []),
      releases: Array.isArray(project.releases)
        ? project.releases.length > 0
          ? project.releases
          : [""]
        : [""],
      screenshots: project.screenshots || [],
      totalEstimatedDays: project.total_estimated_days || 0,
      // Calculate credits from days or use stored credits
      totalCredits: Math.floor((project.total_estimated_days || 0) / 5),
    };
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-2">
          <Link href={`/dashboard/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
        <p className="text-gray-600">Make changes to your project</p>
      </div>

      <ProjectFormProvider initialData={initialData} projectId={projectId}>
        <ProjectForm />
      </ProjectFormProvider>
    </div>
  );
}
