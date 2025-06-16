import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";

type StatusBadgeProps = {
  status: string;
  size?: "sm" | "md" | "lg";
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <CheckCircle className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        );
      case "rejected":
        return <XCircle className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />;
      case "submitted":
        return (
          <AlertCircle className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        );
      case "in_progress":
        return <Loader2 className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />;
      case "completed":
        return (
          <CheckCircle className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        );
      default:
        return <Clock className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-xs py-1 px-2",
    lg: "text-sm py-1 px-3",
  };

  return (
    <Badge
      className={`flex items-center gap-1.5 ${getStatusColor(status)} ${
        sizeClasses[size]
      }`}
    >
      {getStatusIcon(status)}
      <span>{status.replace("_", " ")}</span>
    </Badge>
  );
}
