"use client";

import { ProjectFormProvider, type ProjectFormData } from "./form-context";
import { Step1Basics } from "./steps/step-1-basics";
import { Step2Functional } from "./steps/step-2-functional";
import { Step3Technical } from "./steps/step-3-technical";
import { Step4Deliverables } from "./steps/step-4-deliverables";
import { Step5Releases } from "./steps/step-5-releases";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export function ProjectForm({
  initialData,
  projectId,
}: {
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}) {
  const [formData, setFormData] = useState<
    Partial<ProjectFormData> | undefined
  >(initialData);
  const [loading, setLoading] = useState(projectId ? true : false);
  const params = useParams();

  // Function to calculate credits based on days (1 credit per 5 days, rounded down)
  const calculateCredits = (days: number): number => {
    return Math.floor(days / 5);
  };

  // If projectId is provided, fetch the project data
  useEffect(() => {
    if (projectId || params?.id) {
      const id = projectId || params?.id;
      fetchProject(id as string);
    }
  }, [projectId, params?.id]);

  const fetchProject = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Process the data to match our form structure
      const processedData: Partial<ProjectFormData> = {
        name: data.name,
        summary: data.summary,
        functionalPurpose: data.functional_purpose || [],
        material: data.material || "",
        programmingLanguages: data.programming_languages || [],
        resources: data.resources || [],
        totalEstimatedDays: data.total_estimated_days || 0,
        totalCredits: data.total_xp || calculateCredits(data.total_estimated_days || 0),
        description: data.description || "",
        videoUrl: data.video_url || "",
        projectFolderUrl: data.project_folder_url || "",
      };

      // Parse JSON fields if needed
      if (typeof data.deliverables === "string") {
        try {
          processedData.deliverables = JSON.parse(data.deliverables);
        } catch (e) {
          console.error("Error parsing deliverables:", e);
          processedData.deliverables = [
            { functionality: "", details: "", days: 1 },
          ];
        }
      } else {
        processedData.deliverables = data.deliverables || [
          { functionality: "", details: "", days: 1 },
        ];
      }

      if (typeof data.releases === "string") {
        try {
          processedData.releases = JSON.parse(data.releases);
        } catch (e) {
          console.error("Error parsing releases:", e);
          processedData.releases = [
            { version: "1.0", features: [""] },
            { version: "2.0", features: [""] },
            { version: "3.0", features: [""] },
            { version: "4.0", features: [""] },
          ];
        }
      } else {
        processedData.releases = data.releases || [
          { version: "1.0", features: [""] },
          { version: "2.0", features: [""] },
          { version: "3.0", features: [""] },
          { version: "4.0", features: [""] },
        ];
      }

      // Add default leaders if not present
      processedData.leaders = [{ name: "", tekx: "", position: "" }];

      setFormData(processedData);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-gray-500">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectFormProvider initialData={formData} projectId={projectId}>
      <ProjectFormContent />
    </ProjectFormProvider>
  );
}

function ProjectFormContent() {
  const { currentStep, goToStep, totalSteps } = useProjectForm();

  const steps = [
    { title: "Basics", component: <Step1Basics /> },
    { title: "Functional", component: <Step2Functional /> },
    { title: "Technical", component: <Step3Technical /> },
    { title: "Deliverables", component: <Step4Deliverables /> },
    { title: "Releases", component: <Step5Releases /> },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Tabs
          value={currentStep.toString()}
          onValueChange={(value) => goToStep(Number.parseInt(value))}
        >
          <TabsList className="grid grid-cols-5 w-full">
            {steps.map((step, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                disabled={index > currentStep}
              >
                {index + 1}. {step.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {steps[currentStep].component}
    </div>
  );
}

import { useProjectForm } from "./form-context";