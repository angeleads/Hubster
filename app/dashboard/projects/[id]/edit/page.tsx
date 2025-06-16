"use client";

import { ProjectForm } from "@/components/project-form/project-form";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
        <p className="text-gray-600">Make changes to your project draft</p>
      </div>

      <ProjectForm projectId={projectId} />
    </div>
  );
}
