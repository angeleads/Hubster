import Link from "next/link"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Send } from "lucide-react"
import { ProjectDetails } from "@/types/project"

type ProjectHeaderProps = {
  project: ProjectDetails
  isOwner: boolean
  canEdit: boolean
  canSubmit: boolean
  onEdit: () => void
  onSubmit: () => void
}

export function ProjectHeader({
  project,
  isOwner,
  canEdit,
  canSubmit,
  onEdit,
  onSubmit,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link href="/dashboard" className="text-sm hover:underline bg-purple-200 text-purple-700 border-purple-400 hover:bg-purple-200 hover:text-purple-800 flex items-center mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-black">{project.name}</h2>
        <div className="flex items-center gap-2 mt-1"> 
          <StatusBadge status={project.status} />
          <span className="text-sm text-slate-400">
            Created on {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {canEdit && (
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Button variant="outline" className="border-slate-700 text-slate-600 hover:bg-slate-800" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </Link>
        )}
        {canSubmit && (
          <Button onClick={onSubmit} className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        )}
      </div>
    </div>
  )
}
