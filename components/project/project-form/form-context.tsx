"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type ProjectFormData = {
  name: string;
  summary: string;
  leaders: { name: string; tekx: string; position: string }[];
  functionalPurpose: string[];
  material: string;
  programmingLanguages: string[];
  resources: string[];
  deliverables: { functionality: string; details: string; days: number }[];
  totalEstimatedDays: number;
  totalCredits: number;
  releases: {
    version: string;
    features: string[];
  }[];
  screenshots: string[];
  description: string;
  videoUrl: string;
  projectFolderUrl: string;
};

export type ProjectFormContextType = {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  totalSteps: number;
  isLastStep: boolean;
  isFirstStep: boolean;
  saveAsDraft: () => Promise<void>;
  submitProject: () => Promise<void>;
  isSaving: boolean;
  isSubmitting: boolean;
  projectId: string | null;
  calculateCredits: (days: number) => number;
};

const defaultFormData: ProjectFormData = {
  name: "",
  summary: "",
  leaders: [{ name: "", tekx: "", position: "" }],
  functionalPurpose: [""],
  material: "",
  programmingLanguages: [""],
  resources: [""],
  deliverables: [{ functionality: "", details: "", days: 1 }],
  totalEstimatedDays: 0,
  totalCredits: 0,
  releases: [
    { version: "1.0", features: [""] },
    { version: "2.0", features: [""] },
    { version: "3.0", features: [""] },
    { version: "4.0", features: [""] },
  ],
  screenshots: [],
  description: "",
  videoUrl: "",
  projectFolderUrl: "",
};

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(
  undefined
);

export function ProjectFormProvider({
  children,
  initialData,
  projectId,
}: {
  children: ReactNode;
  initialData?: Partial<ProjectFormData>;
  projectId?: string | null;
}) {
  const [formData, setFormData] = useState<ProjectFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectIdState, setProjectIdState] = useState<string | null>(
    projectId || null
  );

  const totalSteps = 5; // Total number of steps in the form

  // Function to calculate credits based on days (1 credit per 5 days, rounded down)
  const calculateCredits = (days: number): number => {
    return Math.floor(days / 5);
  };

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data };
      
      // Auto-calculate credits when totalEstimatedDays changes
      if (data.totalEstimatedDays !== undefined) {
        updated.totalCredits = calculateCredits(data.totalEstimatedDays);
      }
      
      return updated;
    });
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const saveAsDraft = async () => {
    setIsSaving(true);
    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
        total_xp: formData.totalCredits,
        releases: formData.releases,
        screenshots: formData.screenshots || [],
        description: formData.description || null,
        video_url: formData.videoUrl || null,
        project_folder_url: formData.projectFolderUrl || null,
        status: "draft",
      };

      let result;
      if (projectIdState) {
        const { data, error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", projectIdState)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (error) throw error;
        result = data;
        setProjectIdState(result.id);
      }

      return result;
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const submitProjectAction = async () => {
    setIsSubmitting(true);
    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
        total_xp: formData.totalCredits,
        releases: formData.releases,
        screenshots: formData.screenshots || [],
        description: formData.description || null,
        video_url: formData.videoUrl || null,
        project_folder_url: formData.projectFolderUrl || null,
        status: "submitted",
      };

      let result;
      if (projectIdState) {
        const { data, error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", projectIdState)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (error) throw error;
        result = data;
        setProjectIdState(result.id);
      }

      return result;
    } catch (error) {
      console.error("Error submitting project:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProjectFormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        totalSteps,
        isLastStep: currentStep === totalSteps - 1,
        isFirstStep: currentStep === 0,
        saveAsDraft,
        submitProject: submitProjectAction,
        isSaving,
        isSubmitting,
        projectId: projectIdState,
        calculateCredits,
      }}
    >
      {children}
    </ProjectFormContext.Provider>
  );
}

export const useProjectForm = () => {
  const context = useContext(ProjectFormContext);
  if (context === undefined) {
    throw new Error("useProjectForm must be used within a ProjectFormProvider");
  }
  return context;
};