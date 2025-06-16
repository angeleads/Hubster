import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, User } from "lucide-react";

type AdminSchedulePresenterCardsProps = {
  event: {
    id: string;

    start_date: string;
    end_date: string;
    location: string;
    presenter_id: string;
    presenter_name: string;
  };
};

export default function AdminSchedulePresenterCards({
  event,
}: AdminSchedulePresenterCardsProps) {
  const { profile } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {formatTime(event.start_date)} - {formatTime(event.end_date)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Presenter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.presenter_name}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
