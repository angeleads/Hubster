import { Badge } from "@/components/ui/badge";

type Status =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "draft":
        return {
          label: "Draft",
          variant: "secondary" as const,
          className: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        };
      case "submitted":
        return {
          label: "Submitted",
          variant: "default" as const,
          className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        };
      case "approved":
        return {
          label: "Approved",
          variant: "default" as const,
          className: "bg-green-100 text-green-700 hover:bg-green-200",
        };
      case "rejected":
        return {
          label: "Rejected",
          variant: "destructive" as const,
          className: "bg-red-100 text-red-700 hover:bg-red-200",
        };
      case "in_progress":
        return {
          label: "In Progress",
          variant: "default" as const,
          className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        };
      case "completed":
        return {
          label: "Completed",
          variant: "default" as const,
          className: "bg-purple-100 text-purple-700 hover:bg-purple-200",
        };
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          className: "bg-slate-100 text-slate-700",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}
