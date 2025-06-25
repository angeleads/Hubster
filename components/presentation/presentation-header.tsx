import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  eventType: string;
  status: string;
  canEdit: boolean;
  canDelete: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getEventTypeColor: (type: string) => string;
  getEventTypeLabel: (type: string) => string;
  getStatusColor: (status: string) => string;
};

export function PresentationHeader({
  title,
  eventType,
  status,
  canEdit,
  canDelete,
  isEditing,
  isDeleting,
  onEdit,
  onDelete,
  getEventTypeColor,
  getEventTypeLabel,
  getStatusColor,
}: Props) {
  return (
    <div>
      <Link
        href="/dashboard/presentations"
        className="text-sm text-slate-700 hover:text-purple-500 hover:underline flex items-center mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Presentations
      </Link>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${getEventTypeColor(eventType)} border text-xs`}>
              {getEventTypeLabel(eventType)}
            </Badge>
            <Badge className={`${getStatusColor(status)} border text-xs`}>{status}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && !isEditing && (
            <Button
              onClick={onEdit}
              variant="outline"
              className="border-purple-700 text-purple-700 hover:bg-purple-200 hover:text-purple-800"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={onDelete}
              disabled={isDeleting}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
