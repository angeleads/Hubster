"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export type ProjectFormData = {
  name: string
  summary: string
  leaders: { name: string; tekx: string; position: string }[]
  functionalPurpose: string[]
  material: string
  programmingLanguages: string[]
  resources: string[]
  deliverables: { functionality: string; details: string; days: number }[]
  totalEstimatedDays: number
  totalCredits: number
  releases: {
    version: string
    features: string[]
  }[]
  screenshots: string[]
  description: string
  videoUrl: string
  projectFolderUrl: string
}

export type ProjectFormContextType = {
  formData: ProjectFormData
  updateFormData: (data: Partial<ProjectFormData>) => void
  currentStep: number
  goToNextStep: () => void
  goToPreviousStep: () => void
  goToStep: (step: number) => void
  totalSteps: number
  isLastStep: boolean
  isFirstStep: boolean
  saveAsDraft: () => Promise<void>
  submitProject: () => Promise<void>
  isSaving: boolean
  isSubmitting: boolean
  projectId: string | null
  calculateCredits: (days: number) => number
}

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
}

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(undefined)

export function ProjectFormProvider({
  children,
  initialData,
  projectId,
}: {
  children: ReactNode
  initialData?: Partial<ProjectFormData>
  projectId?: string | null
}) {
  const [formData, setFormData] = useState<ProjectFormData>({
    ...defaultFormData,
    ...initialData,
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectIdState, setProjectIdState] = useState<string | null>(projectId || null)

  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 5 // Total number of steps in the form

  // Function to calculate credits based on days (1 credit per 5 days, rounded down)
  const calculateCredits = (days: number): number => {
    return Math.floor(days / 5)
  }

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data }

      // Auto-calculate total estimated days and credits from deliverables
      if (data.deliverables || data.totalEstimatedDays !== undefined) {
        const totalDays = updated.deliverables.reduce((total, deliverable) => total + deliverable.days, 0)
        updated.totalEstimatedDays = totalDays
        updated.totalCredits = calculateCredits(totalDays)
      }

      return updated
    })
  }

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }

  // Convert deliverables to array of arrays format for database storage
  const formatDeliverablesForDB = (deliverables: { functionality: string; details: string; days: number }[]) => {
    return deliverables.map((d) => [d.functionality, d.details, d.days])
  }

  // Convert array of arrays format from database to form format
  const formatDeliverablesFromDB = (
    deliverables: any[],
  ): { functionality: string; details: string; days: number }[] => {
    if (!Array.isArray(deliverables)) return [{ functionality: "", details: "", days: 1 }]

    return deliverables.map((d) => {
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
      return { functionality: "", details: "", days: 1 }
    })
  }

  const saveAsDraft = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const credits = calculateCredits(formData.totalEstimatedDays)

      const projectData = {
        user_id: user.id,
        title: formData.name,
        description: formData.description,
        project_type: "student_project",
        functional_requirements: formData.functionalPurpose.filter((req) => req.trim() !== ""),
        technical_requirements: formData.programmingLanguages.filter((req) => req.trim() !== ""),
        deliverables: formatDeliverablesForDB(formData.deliverables),
        timeline_estimate: `${formData.totalEstimatedDays} days`,
        credits,
        github_url: formData.projectFolderUrl || null,
        demo_url: formData.videoUrl || null,
        file_attachments: [],
        status: "draft",
        updated_at: new Date().toISOString(),
        likes_count: 0,
      }

      let result
      if (projectIdState) {
        // For updates, first verify the project exists and user owns it
        const { data: existingProject, error: checkError } = await supabase
          .from("projects")
          .select("id, user_id, status")
          .eq("id", projectIdState)
          .single()

        if (checkError) {
          console.error("Error checking project:", checkError)
          throw new Error("Project not found or access denied")
        }

        if (!existingProject) {
          throw new Error("Project not found")
        }

        if (existingProject.user_id !== user.id) {
          throw new Error("You don't have permission to edit this project")
        }

        // Remove user_id from update data since it shouldn't change
        const { user_id, ...updateData } = projectData

        const { data, error } = await supabase
          .from("projects")
          .update(updateData)
          .eq("id", projectIdState)
          .eq("user_id", user.id)
          .select()

        if (error) {
          console.error("Update error:", error)
          throw error
        }

        if (!data || data.length === 0) {
          throw new Error("No rows were updated. Please check your permissions.")
        }

        result = Array.isArray(data) ? data[0] : data
      } else {
        const { data, error } = await supabase.from("projects").insert(projectData).select().single()

        if (error) throw error
        result = data
        setProjectIdState(result.id)
      }

      toast({
        title: "Success",
        description: projectIdState ? "Project updated as draft" : "Project saved as draft",
      })

      return result
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project as draft",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const submitProjectAction = async () => {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const credits = calculateCredits(formData.totalEstimatedDays)

      const projectData = {
        user_id: user.id,
        title: formData.name,
        description: formData.description,
        project_type: "student_project",
        functional_requirements: formData.functionalPurpose.filter((req) => req.trim() !== ""),
        technical_requirements: formData.programmingLanguages.filter((req) => req.trim() !== ""),
        deliverables: formatDeliverablesForDB(formData.deliverables),
        timeline_estimate: `${formData.totalEstimatedDays} days`,
        credits,
        github_url: formData.projectFolderUrl || null,
        demo_url: formData.videoUrl || null,
        file_attachments: [],
        status: "submitted",
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 0,
      }

      let result
      if (projectIdState) {
        // For updates, first verify the project exists and user owns it
        const { data: existingProject, error: checkError } = await supabase
          .from("projects")
          .select("id, user_id, status")
          .eq("id", projectIdState)
          .single()

        if (checkError) {
          console.error("Error checking project:", checkError)
          throw new Error("Project not found or access denied")
        }

        if (!existingProject) {
          throw new Error("Project not found")
        }

        if (existingProject.user_id !== user.id) {
          throw new Error("You don't have permission to edit this project")
        }

        // Check if project can be edited
        if (!["draft", "rejected", "submitted", "approved"].includes(existingProject.status)) {
          throw new Error("This project cannot be edited in its current status")
        }

        // Remove user_id from update data since it shouldn't change
        const { user_id, ...updateData } = projectData

        const { data, error } = await supabase
          .from("projects")
          .update(updateData)
          .eq("id", projectIdState)
          .eq("user_id", user.id)
          .select()

        if (error) {
          console.error("Update error:", error)
          throw error
        }

        if (!data || data.length === 0) {
          throw new Error("No rows were updated. Please check your permissions.")
        }

        result = Array.isArray(data) ? data[0] : data
      } else {
        const { data, error } = await supabase.from("projects").insert(projectData).select().single()

        if (error) throw error
        result = data
        setProjectIdState(result.id)
      }

      toast({
        title: "Success",
        description: projectIdState ? "Project updated and submitted!" : "Project submitted successfully!",
      })

      router.push(`/dashboard/projects/${result.id}`)

      return result
    } catch (error) {
      console.error("Error submitting project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit project",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

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
  )
}

export const useProjectForm = () => {
  const context = useContext(ProjectFormContext)
  if (context === undefined) {
    throw new Error("useProjectForm must be used within a ProjectFormProvider")
  }
  return context
}
