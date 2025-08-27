"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { ProjectFeedback } from "@/components/project/detail-information/project-feeback";
import { ProjectLikeButton } from "@/components/project/detail-information/project-like-buttons";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Github,
  Calendar,
  User,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: string;
  project_type: string;
  functional_requirements: string[];
  technical_requirements: string[];
  deliverables: any[]; // Array of arrays: [title, details, days]
  timeline_estimate: string;
  credits: number;
  github_url: string;
  demo_url: string;
  file_attachments: string[];
  likes_count: number;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  completed_at: string;
  profiles: {
    full_name: string;
    email: string;
    role: string;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          profiles:user_id (
            full_name,
            email,
            role
          )
        `
        )
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectStatus = async (newStatus: string) => {
    if (!project) return;

    setIsUpdatingStatus(true);
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId);

      if (error) throw error;

      setProject({ ...project, ...updateData });
      toast({
        title: "Success",
        description: `Project ${newStatus} successfully`,
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Format deliverables for display
  const formatDeliverables = (deliverables: any[]) => {
    if (!Array.isArray(deliverables)) return [];

    return deliverables.map((d, index) => {
      if (Array.isArray(d) && d.length >= 3) {
        return {
          title: d[0] || `Deliverable ${index + 1}`,
          details: d[1] || "No details provided",
          days: Number(d[2]) || 0,
        };
      }
      // Fallback for old format
      if (typeof d === "object" && d.functionality) {
        return {
          title: d.functionality || `Deliverable ${index + 1}`,
          details: d.details || "No details provided",
          days: Number(d.days) || 0,
        };
      }
      return {
        title: `Deliverable ${index + 1}`,
        details: "No details provided",
        days: 0,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message={error || "Project not found"} />
      </div>
    );
  }

  const isOwner = user?.id === project.user_id;
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
  const canEdit =
    isOwner &&
    (project.status === "draft" ||
      project.status === "rejected" ||
      project.status === "submitted");
  const formattedDeliverables = formatDeliverables(project.deliverables);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:underline">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {canEdit && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/projects/${projectId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Link>
            </Button>
          )}
          <ProjectLikeButton
            projectId={projectId}
            initialLikesCount={project.likes_count}
          />
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {project.profiles.full_name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {project.timeline_estimate}
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {project.credits} credits
                </div>
              </div>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {project.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          {project.functional_requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Functional Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                {project.functional_requirements.map((req, index) => (
                  <li key={index} className="text-muted-foreground">
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.technical_requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Technical Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {project.technical_requirements.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {formattedDeliverables.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Project Deliverables
              </h3>
              <div className="space-y-4">
                {formattedDeliverables.map((deliverable, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-2">
                            {deliverable.title}
                          </h4>
                          <p className="text-muted-foreground text-sm mb-2">
                            {deliverable.details}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {deliverable.days} days
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Summary */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-purple-600" />
                        <span className="font-semibold text-purple-700">
                          Total Project Scope
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="outline"
                          className="bg-white border-purple-200"
                        >
                          {formattedDeliverables.reduce(
                            (total, d) => total + d.days,
                            0
                          )}{" "}
                          days
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white border-green-200 text-green-700"
                        >
                          {project.credits} credits
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {(project.github_url || project.demo_url) && (
            <div>
              <h3 className="font-semibold mb-2">Links</h3>
              <div className="flex space-x-4">
                {project.github_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
                {project.demo_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {isAdmin && project.status === "submitted" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">
                Admin
              </Badge>
              Project Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                onClick={() => updateProjectStatus("approved")}
                disabled={isUpdatingStatus}
                className="bg-purple-200 text-purple-600 hover:bg-purple-300 hover:text-purple-800"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => updateProjectStatus("rejected")}
                disabled={isUpdatingStatus}
                className="bg-red-200 text-red-600 hover:bg-red-300 hover:text-red-800"
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Admin Actions for Different Statuses */}
      {isAdmin && project.status === "approved" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">
                Admin
              </Badge>
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => updateProjectStatus("in_progress")}
              disabled={isUpdatingStatus}
              className="bg-purple-400 hover:bg-purple-500"
            >
              <Play className="h-4 w-4 mr-2" />
              Mark In Progress
            </Button>
          </CardContent>
        </Card>
      )}

      {isAdmin && project.status === "in_progress" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">
                Admin
              </Badge>
              Project Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => updateProjectStatus("completed")}
              disabled={isUpdatingStatus}
              className="bg-green-300 text-green-800 hover:bg-green-300 hover:text-green-900"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Completed
            </Button>
          </CardContent>
        </Card>
      )}

      {isAdmin && project.status === "rejected" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">
                Admin
              </Badge>
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => updateProjectStatus("submitted")}
              disabled={isUpdatingStatus}
              className="bg-yellow-200 text-yellow-800 hover:text-yellow-800 hover:bg-yellow-300"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reopen for Review
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Project Feedback */}
      <ProjectFeedback projectId={projectId} projectOwnerId={project.user_id} />
    </div>
  );
}
