"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminPresentationDetailCard from "@/components/cards/admin/admin-presentation-detail-card";
import AdminPresentationReviewCard from "@/components/cards/admin/admin-presentation-review-card";
import AdminSchedulePresenterCards from "@/components/cards/admin/admin-schedule-presenter-cards";

type Event = {
  id: string;
  title: string;
  description: string;
  event_type: "talk" | "conference" | "workshop" | "user_group";
  start_date: string;
  end_date: string;
  location: string;
  presenter_id: string;
  presenter_name: string;
  status: "pending" | "approved" | "rejected";
  file_url: string | null;
  admin_feedback: string | null;
};

export default function PresentationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const eventId = params.id as string;

  useEffect(() => {
    if (profile) {
      if (profile.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      fetchEvent();
    }
  }, [profile, eventId, router]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      setEvent(data);
      setFeedback(data.admin_feedback || "");
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Error",
        description: "Failed to load presentation details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile || profile.role !== "admin" || !event) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/presentations"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Presentations
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getEventTypeColor(event.event_type)}>
                {getEventTypeLabel(event.event_type)}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <AdminPresentationDetailCard event={event} />

          {event.status === "pending" && (
            <AdminPresentationReviewCard
              fetchEvent={fetchEvent}
              event={event}
            />
          )}

          {event.admin_feedback && event.status !== "pending" && (
            <Card
              className={
                event.status === "rejected"
                  ? "border-red-200"
                  : "border-green-200"
              }
            >
              <CardHeader
                className={
                  event.status === "rejected" ? "bg-red-50" : "bg-green-50"
                }
              >
                <CardTitle>Astek's Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{event.admin_feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <AdminSchedulePresenterCards event={event} />
      </div>
    </div>
  );
}
