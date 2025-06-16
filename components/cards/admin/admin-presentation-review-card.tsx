import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function AdminPresentationReviewCard({
  fetchEvent,
  event,
}: {
  fetchEvent: () => void;
  event: any;
}) {
  const params = useParams();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const eventId = params.id as string;

  const handleApprove = async () => {
    if (!event) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("events")
        .update({
          status: "approved",
          admin_feedback: feedback || "Presentation approved",
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Presentation Approved",
        description: "The presentation has been approved successfully",
      });

      fetchEvent();
    } catch (error) {
      console.error("Error approving presentation:", error);
      toast({
        title: "Error",
        description: "Failed to approve presentation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!event || !feedback) {
      toast({
        title: "Feedback Required",
        description:
          "Please provide feedback before rejecting the presentation",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("events")
        .update({
          status: "rejected",
          admin_feedback: feedback,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Presentation Rejected",
        description: "The presentation has been rejected with feedback",
      });

      fetchEvent();
    } catch (error) {
      console.error("Error rejecting presentation:", error);
      toast({
        title: "Error",
        description: "Failed to reject presentation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Presentation</CardTitle>
        <CardDescription>
          Approve or reject this presentation request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Provide feedback to the presenter..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={submitting || !feedback}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button onClick={handleApprove} disabled={submitting}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
