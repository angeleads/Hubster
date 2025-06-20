import { Button } from "@/components/ui/button";
import { Edit, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";

type ProjectActionsProps = {
  isOwner: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canReview: boolean;
  projectId: string;
  onEdit: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function ProjectActions({
  isOwner,
  canEdit,
  canSubmit,
  canReview,
  projectId,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
}: ProjectActionsProps) {
  return (
    <div className="flex gap-2">
      {canEdit && (
        <Link href={`/dashboard/projects/${projectId}/edit`}>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-600 hover:bg-slate-800"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </Link>
      )}
      {canSubmit && (
        <Button
          onClick={onSubmit}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Submit for Review
        </Button>
      )}
      {canReview && (
        <>
          <Button
            onClick={onApprove}
            className="bg-green-600 hover:bg-green-700"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button onClick={onReject} className="bg-red-600 hover:bg-red-700">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </>
      )}
    </div>
  );
}
