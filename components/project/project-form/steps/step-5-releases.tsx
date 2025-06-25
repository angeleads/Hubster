"use client";

import type React from "react";

import { useProjectForm } from "../form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Trash2, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Step5Releases() {
  const {
    formData,
    updateFormData,
    goToPreviousStep,
    saveAsDraft,
    submitProject,
    isSaving,
    isSubmitting,
  } = useProjectForm();
  const { toast } = useToast();
  const router = useRouter();

  // Ensure releases is always an array
  useEffect(() => {
    if (
      !formData.releases ||
      !Array.isArray(formData.releases) ||
      formData.releases.length === 0
    ) {
      // Only update if necessary to avoid infinite loops
      const defaultReleases = [
        { version: "1.0", features: [""] },
        { version: "2.0", features: [""] },
        { version: "3.0", features: [""] },
        { version: "4.0", features: [""] },
      ];

      // Check if we need to update to avoid infinite loops
      const needsUpdate =
        !formData.releases ||
        !Array.isArray(formData.releases) ||
        formData.releases.length === 0;

      if (needsUpdate) {
        updateFormData({
          releases: defaultReleases,
        });
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Use a safe version of releases that's guaranteed to be an array
  const releases = Array.isArray(formData.releases)
    ? formData.releases
    : [
        { version: "1.0", features: [""] },
        { version: "2.0", features: [""] },
        { version: "3.0", features: [""] },
        { version: "4.0", features: [""] },
      ];

  const handleAddFeature = (releaseIndex: number) => {
    const newReleases = [...releases];
    newReleases[releaseIndex].features.push("");
    updateFormData({ releases: newReleases });
  };

  const handleRemoveFeature = (releaseIndex: number, featureIndex: number) => {
    const newReleases = [...releases];
    newReleases[releaseIndex].features.splice(featureIndex, 1);
    updateFormData({ releases: newReleases });
  };

  const handleFeatureChange = (
    releaseIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const newReleases = [...releases];
    newReleases[releaseIndex].features[featureIndex] = value;
    updateFormData({ releases: newReleases });
  };

  const handleSaveAsDraft = async () => {
    try {
      await saveAsDraft();
      toast({
        title: "Draft Saved",
        description: "Your project has been saved as a draft.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitProject();
      toast({
        title: "Project Submitted",
        description: "Your project has been submitted for review.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Releases</CardTitle>
          <CardDescription>
            Break down your project into releases (25%, 50%, 75%, 100%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {releases.map((release, releaseIndex) => (
            <div key={releaseIndex} className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Release {release.version}</h3>
                <span className="text-sm text-gray-500">
                  {releaseIndex === 0
                    ? "25%"
                    : releaseIndex === 1
                    ? "50%"
                    : releaseIndex === 2
                    ? "75%"
                    : "100%"}
                </span>
              </div>

              <div className="space-y-2">
                {Array.isArray(release.features) &&
                  release.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(
                            releaseIndex,
                            featureIndex,
                            e.target.value
                          )
                        }
                        placeholder="e.g., Task 1 done"
                        required
                      />
                      {featureIndex > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveFeature(releaseIndex, featureIndex)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddFeature(releaseIndex)}
                  className="w-full mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
          <CardDescription>
            Provide information about project delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Light Description (mandatory)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Provide a brief description of your project"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => updateFormData({ videoUrl: e.target.value })}
              placeholder="e.g., https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectFolderUrl">
              Project Folder/Website URL (optional)
            </Label>
            <Input
              id="projectFolderUrl"
              value={formData.projectFolderUrl}
              onChange={(e) =>
                updateFormData({ projectFolderUrl: e.target.value })
              }
              placeholder="e.g., https://github.com/username/project"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Previous Step
        </Button>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>
          <Button type="submit" disabled={isSaving || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Project
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
