import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
};

export function StatusBadge({ 
  status, 
  size = "md", 
  showIcon = true,
  className 
}: StatusBadgeProps) {
  const getStatusIcon = (status: string) => {
    const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
    
    switch (status) {
      case "approved":
        return <CheckCircle className={iconSize} />;
      case "rejected":
        return <XCircle className={iconSize} />;
      case "submitted":
        return <AlertCircle className={iconSize} />;
      case "in_progress":
        return <Loader2 className={cn(iconSize, "animate-spin")} />;
      case "completed":
        return <CheckCircle className={iconSize} />;
      case "draft":
        return <FileText className={iconSize} />;
      default:
        return <Clock className={iconSize} />;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          label: "Approved"
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Rejected"
        };
      case "submitted":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          label: "Pending Review"
        };
      case "in_progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "In Progress"
        };
      case "completed":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          label: "Completed"
        };
      case "draft":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Draft"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: status.replace("_", " ")
        };
    }
  };

  const sizeClasses = {
    sm: "text-xs py-1 px-2",
    md: "text-xs py-1.5 px-3",
    lg: "text-sm py-2 px-4",
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border",
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && getStatusIcon(status)}
      <span>{config.label}</span>
    </Badge>
  );
}