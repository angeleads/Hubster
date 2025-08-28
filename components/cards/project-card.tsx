import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Heart,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export type ProjectCardProps = {
  id: string
  title: string
  description: string | null
  status: string
  timelineEstimate: string
  createdAt: string
  submittedAt?: string | null
  studentName?: string
  isAdmin?: boolean
  isDraft?: boolean
  likesCount?: number;
};

export function ProjectCard({
  id,
  title,
  description,
  status,
  timelineEstimate,
  submittedAt,
  studentName,
  isAdmin = false,
  isDraft = false,
  likesCount = 0,
}: ProjectCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "submitted":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="flex h-full flex-col duration-300 ">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg font-semibold">
              {title}
            </CardTitle>
            {isAdmin && studentName && (
              <CardDescription className="mt-1 text-xs">
                by {studentName}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {getStatusIcon(status)}
            <StatusBadge status={status as any} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4 pt-0">
        <p className="min-h-[60px] text-sm text-gray-600 line-clamp-3">
          {description || "No description provided."}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{timelineEstimate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            <span>{likesCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-purple-50/50 p-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-purple-500">
          {submittedAt && (
            <>
              <Calendar className="h-4 w-4" />
              <span>{new Date(submittedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isDraft && (
            <Link href={`/dashboard/projects/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          )}
          <Link href={`/dashboard/projects/${id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
