"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, Upload } from "lucide-react";
import Link from "next/link";

export default function NewPresentationPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [filePreview, setFilePreview] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, file }));

      // Create a preview URL for the file
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);

    try {
      // Calculate end date based on start date and times
      const startDate = new Date(
        `${formData.preferredDate}T${formData.preferredStartTime}`
      );
      const endDate = new Date(
        `${formData.preferredDate}T${formData.preferredEndTime}`
      );

      // Upload file if provided
      let fileUrl = null;
      if (formData.file) {
        try {
          const fileExt = formData.file.name.split(".").pop();
          const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
          const filePath = `${profile.id}/${fileName}`; // Add user ID as folder for better organization

          // Try to upload the file
          const { error: uploadError, data } = await supabase.storage
            .from("presentations")
            .upload(filePath, formData.file);

          if (uploadError) {
            console.error("File upload error:", uploadError);
            // Show warning but continue with submission
            toast({
              title: "File Upload Failed",
              description:
                "Your presentation will be submitted without the file attachment.",
              variant: "default",
            });
          } else {
            // Get public URL only if upload succeeded
            const { data: urlData } = supabase.storage
              .from("presentations")
              .getPublicUrl(filePath);
            fileUrl = urlData.publicUrl;
          }
        } catch (error) {
          console.error("File upload error:", error);
          // Show warning but continue with submission
          toast({
            title: "File Upload Failed",
            description:
              "Your presentation will be submitted without the file attachment.",
            variant: "default",
          });
        }
      }

      // Create event record
      const { data: event, error } = await supabase
        .from("events")
        .insert({
          title: formData.title,
          description: formData.description,
          event_type: formData.eventType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          location: formData.location,
          presenter_id: profile.id,
          presenter_name: profile.full_name,
          status: "pending",
          file_url: fileUrl,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Presentation Scheduled",
        description: "Your presentation has been submitted for approval.",
      });

      router.push("/dashboard/presentations");
    } catch (error) {
      console.error("Error scheduling presentation:", error);
      toast({
        title: "Error",
        description: "Failed to schedule presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/presentations"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Presentations
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          Schedule a Presentation
        </h2>
        <p className="text-gray-600">
          Fill out the form to request a presentation slot
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presentation Details</CardTitle>
          <CardDescription>
            Provide information about your presentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventType">Presentation Type</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) =>
                    handleSelectChange("eventType", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="talk">Talk</SelectItem>
                    <SelectItem value="user_group">User Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter presentation title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your presentation"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where will this be held?"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredStartTime">Start Time</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="preferredStartTime"
                      name="preferredStartTime"
                      type="time"
                      value={formData.preferredStartTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredEndTime">End Time</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="preferredEndTime"
                      name="preferredEndTime"
                      type="time"
                      value={formData.preferredEndTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Presentation File (Optional)</Label>
                <div className="border-2 border-dashed rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {formData.file
                        ? formData.file.name
                        : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, PPTX, or DOC up to 10MB
                    </span>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.pptx,.doc,.docx"
                    />
                  </label>
                </div>
                {filePreview && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                          <span className="text-xs text-blue-800">
                            {formData.file?.name
                              .split(".")
                              .pop()
                              ?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formData.file?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.file?.size
                            ? (formData.file.size / 1024 / 1024).toFixed(2) +
                              " MB"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  "Schedule Presentation"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
