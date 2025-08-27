"use client"

import { ProjectFormProvider } from "@/components/project/project-form/form-context"
import { ProjectForm } from "@/components/project/project-form/project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
        <p className="text-gray-600">Fill out the form below to submit your project for review</p>
      </div>

      <ProjectFormProvider>
        <ProjectForm />
      </ProjectFormProvider>
    </div>
  )
}
