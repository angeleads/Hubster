import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
} from "lucide-react";
import Link from "next/link";

export type ProjectCardProps = {
  id: string;
  name: string;
  summary: string;
  programmingLanguages: string[];
  status: string;
  totalEstimatedDays: number;
  createdAt: string;
  presentationDate?: string | null;
  studentName?: string;
  isAdmin?: boolean;
  isDraft?: boolean;
};

export function ProjectCard({
  id,
  name,
  summary,
  programmingLanguages,
  status,
  totalEstimatedDays,
  createdAt,
  presentationDate,
  studentName,
  isAdmin = false,
  isDraft = false,
}: ProjectCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 mr-2 text-red-500" />;
      case "submitted":
        return <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "submitted":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "completed":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            {isAdmin && studentName && (
              <CardDescription className="mt-1">
                by {studentName}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(status)}>
              {getStatusIcon(status)}
              {status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{summary}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{totalEstimatedDays} days</span>
          </div>
          {presentationDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(presentationDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 pt-4">
          {(programmingLanguages ?? []).map((lang) => (
            <Badge
              key={lang}
              className=" bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs"
            >
              {lang}
            </Badge>
          ))}
          {isDraft && (
            <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <div className="space-x-2">
            <Link href={`/dashboard/projects/${id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-800 rounded-xl"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            <Link href={`/dashboard/projects/${id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-800 rounded-xl"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
