"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { PresentationHeader } from "@/components/presentation/presentation-header";
import { PresentationEditForm } from "@/components/presentation/presentation-edit-form";
import { PresentationInfo } from "@/components/presentation/presentation-info";
import { PresentationNotFound } from "@/components/presentation/presentation-not-found";

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
  created_at: string;
  updated_at: string;
};

export default function PresentationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "talk",
    preferredDate: "",
    preferredStartTime: "",
    preferredEndTime: "",
    location: "",
    file: null as File | null,
  });
  const [presenterName, setPresenterName] = useState("Unknown Presenter")

  useEffect(() => {
    async function fetchPresenterName() {
      if (!event?.presenter_id) return
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", event.presenter_id)
        .single()
      if (data && data.full_name) {
        setPresenterName(data.full_name)
      }
    }
    fetchPresenterName()
  }, [event?.presenter_id])

  const eventId = params.id as string;

  useEffect(() => {
    if (profile) {
      fetchEvent();
    }
    // eslint-disable-next-line
  }, [profile, eventId]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();

      if (error) throw error;

      if (data.presenter_id !== profile?.id && profile?.role !== "admin") {
        setError("You don't have permission to view this presentation");
        return;
      }

      setEvent(data);

      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      setFormData({
        title: data.title,
        description: data.description,
        eventType: data.event_type,
        preferredDate: startDate.toISOString().split("T")[0],
        preferredStartTime: startDate.toTimeString().slice(0, 5),
        preferredEndTime: endDate.toTimeString().slice(0, 5),
        location: data.location,
        file: null,
      });
    } catch (error: any) {
      setError("Failed to load presentation details");
      toast({
        title: "Error",
        description: "Failed to load presentation details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files && e.target.files.length > 0) {
        setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
      }
    }
  };

  const handleSave = async () => {
    if (!event || !profile) return;

    setIsSaving(true);

    try {
      const startDate = new Date(`${formData.preferredDate}T${formData.preferredStartTime}`);
      const endDate = new Date(`${formData.preferredDate}T${formData.preferredEndTime}`);

      let fileUrl = event.file_url;
      if (formData.file) {
        try {
          const fileExt = formData.file.name.split(".").pop();
          const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
          const filePath = `${profile.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage.from("presentations").upload(filePath, formData.file);

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from("presentations").getPublicUrl(filePath);
            fileUrl = urlData.publicUrl;

            if (event.file_url) {
              try {
                const oldFilePath = event.file_url.split("/").slice(-2).join("/");
                await supabase.storage.from("presentations").remove([oldFilePath]);
              } catch (deleteError) {
                // ignore
              }
            }
          }
        } catch (error) {
          // ignore
        }
      }

      const { error } = await supabase
        .from("events")
        .update({
          title: formData.title,
          description: formData.description,
          event_type: formData.eventType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          location: formData.location,
          file_url: fileUrl,
          status: event.status === "rejected" ? "pending" : event.status,
          admin_feedback: event.status === "rejected" ? null : event.admin_feedback,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Presentation Updated",
        description: "Your presentation has been updated successfully.",
      });

      setIsEditing(false);
      fetchEvent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !profile) return;

    if (!confirm("Are you sure you want to delete this presentation? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      if (event.file_url) {
        try {
          const filePath = event.file_url.split("/").slice(-2).join("/");
          await supabase.storage.from("presentations").remove([filePath]);
        } catch (deleteError) {
          // ignore
        }
      }

      const { error } = await supabase.from("events").delete().eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Presentation Deleted",
        description: "Your presentation has been deleted successfully.",
      });

      router.push("/dashboard/presentations");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "talk":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "conference":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "workshop":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "user_group":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
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
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading presentation..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchEvent} />;
  }

  if (!event) {
    return <PresentationNotFound />;
  }

  const canEdit = event.presenter_id === profile?.id && (event.status === "pending" || event.status === "rejected");
  const canDelete = event.presenter_id === profile?.id && event.status !== "approved";

  return (
    <div className="space-y-6">
      <PresentationHeader
        title={event.title}
        eventType={event.event_type}
        status={event.status}
        canEdit={canEdit}
        canDelete={canDelete}
        isEditing={isEditing}
        isDeleting={isDeleting}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        getEventTypeColor={getEventTypeColor}
        getEventTypeLabel={getEventTypeLabel}
        getStatusColor={getStatusColor}
      />
      {isEditing ? (
        <PresentationEditForm
          formData={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          onFileChange={handleFileChange}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isSaving={isSaving}
        />
      ) : (
        <PresentationInfo event={event} formatDate={formatDate} formatTime={formatTime} />
      )}
    </div>
  );
}
