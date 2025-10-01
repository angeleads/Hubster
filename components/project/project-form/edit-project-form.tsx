"use client";

import { useRouter } from "next/navigation";
import {
  ProjectFormProvider,
  ProjectFormData,
} from "@/components/project/project-form/form-context";
import { ProjectForm } from "@/components/project/project-form/project-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EditProjectForm({
  project,
  initialData,
}: {
  project: any;
  initialData: Partial<ProjectFormData>;
}) {
  const router = useRouter();

  // Ensure all dynamic array data is correctly formatted for the form.
  // Each array must contain at least one item (an empty string) to render an input field.
  const formattedInitialData = {
    ...initialData,
    functionalPurpose:
      Array.isArray(initialData.functionalPurpose) &&
      initialData.functionalPurpose.length > 0
        ? initialData.functionalPurpose
        : [""],
    programmingLanguages:
      Array.isArray(initialData.programmingLanguages) &&
      initialData.programmingLanguages.length > 0
        ? initialData.programmingLanguages
        : [""],
    resources:
      Array.isArray(initialData.resources) && initialData.resources.length > 0
        ? initialData.resources
        : [""],
    releases:
      Array.isArray(initialData.releases) && initialData.releases.length > 0
        ? initialData.releases.map((release) => ({
          ...release,
          features:
            Array.isArray(release.features) && release.features.length > 0
              ? release.features
              : [""],
        }))
        : [
          { version: "1.0", features: [""] },
          { version: "2.0", features: [""] },
          { version: "3.0", features: [""] },
          { version: "4.0", features: [""] },
        ],
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-2">
          <Link href={`/dashboard/projects/${project.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
        <p className="text-gray-600">Make changes to your project</p>
      </div>

      <ProjectFormProvider initialData={formattedInitialData} projectId={project.id}>
        <ProjectForm />
      </ProjectFormProvider>
    </div>
  );
}
