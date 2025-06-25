import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

type EventProps = {
  event: {
    id: string;
    title: string;
    description: string;
    event_type: "talk" | "conference" | "workshop" | "user_group";
    start_date: string;
    end_date: string;
    location: string;
    presenter_id: string;
    presenter_name: string;
  };
};

export function EventCard({ event }: EventProps) {
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
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
      case "conference":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900";
      case "workshop":
        return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900";
      case "user_group":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900";
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6 ">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{event.title}</h3>
            <Badge className={getEventTypeColor(event.event_type)}>
              {getEventTypeLabel(event.event_type)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {event.description}
          </p>
          <div className="space-y-1 text-sm">
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
        <div className="border-t p-3 bg-white flex justify-end">
          <Link href={`/dashboard/presentations/${event.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
