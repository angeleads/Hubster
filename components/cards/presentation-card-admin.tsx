import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

type PresentationCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    event_type: "talk" | "conference" | "workshop" | "user_group";
    start_date: string;
    end_date: string;
    location: string;
    presenter_name: string;
    status: "pending" | "approved" | "rejected";
  };
  isAdmin?: boolean;
};

export function PresentationCardAdmin({
  event,
  isAdmin = false,
}: PresentationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "talk":
        return "bg-blue-100 text-blue-800";
      case "conference":
        return "bg-purple-100 text-purple-800";
      case "workshop":
        return "bg-green-100 text-green-800";
      case "user_group":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "user_group":
        return "User Group";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{event.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getEventTypeColor(event.event_type)}>
                {getEventTypeLabel(event.event_type)}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(event.start_date)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {formatTime(event.start_date)} - {formatTime(event.end_date)}
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <User className="h-4 w-4 mr-2" />
              <span>{event.presenter_name}</span>
            </div>
          </div>
        </div>
        <div className="border-t p-3 bg-gray-50 flex justify-end">
          <Link
            href={
              isAdmin
                ? `/dashboard/admin/presentations/${event.id}`
                : `/dashboard/events/${event.id}`
            }
          >
            <Button variant="outline" size="sm">
              {event.status === "pending" && isAdmin
                ? "Review"
                : "View Details"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
