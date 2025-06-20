"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/cards/project-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchAndFilter } from "@/components/utils/search-and-filter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type Project = {
  id: string;
  name: string;
  summary: string;
  status: string;
  total_estimated_days: number;
  created_at: string;
  presentation_date: string | null;
  student_id: string;
  programmingLanguages?: string[];
  profiles: {
    full_name: string;
    email: string;
  };
};

export default function AdminProjectsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["all"]);

  useEffect(() => {
    if (profile) {
      if (profile.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      fetchProjects();
    }
  }, [profile, router]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          profiles:student_id (
            full_name,
            email
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Fetched projects:", data); // Debug log
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    if (status === "all") {
      setStatusFilter(["all"]);
      return;
    }

    const newFilter = statusFilter.filter((s) => s !== "all");

    if (newFilter.includes(status)) {
      const filtered = newFilter.filter((s) => s !== status);
      setStatusFilter(filtered.length === 0 ? ["all"] : filtered);
    } else {
      setStatusFilter([...newFilter, status]);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.profiles?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter.includes("all") || statusFilter.includes(project.status);

    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.status === "submitted" && b.status !== "submitted") return -1;
    if (a.status !== "submitted" && b.status === "submitted") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return <LoadingSpinner message="Loading projects..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProjects} />;
  }

  if (!profile || profile.role !== "admin") {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  const filterContent = (
    <>
      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("all")}
        onCheckedChange={() => setStatusFilter(["all"])}
      >
        All Statuses
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("submitted")}
        onCheckedChange={() => handleStatusFilterChange("submitted")}
      >
        <div className="flex items-center">
          <StatusBadge status="submitted" size="sm" />
          <span className="ml-2">Submitted</span>
        </div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("approved")}
        onCheckedChange={() => handleStatusFilterChange("approved")}
      >
        <div className="flex items-center">
          <StatusBadge status="approved" size="sm" />
          <span className="ml-2">Approved</span>
        </div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("rejected")}
        onCheckedChange={() => handleStatusFilterChange("rejected")}
      >
        <div className="flex items-center">
          <StatusBadge status="rejected" size="sm" />
          <span className="ml-2">Rejected</span>
        </div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("draft")}
        onCheckedChange={() => handleStatusFilterChange("draft")}
      >
        <div className="flex items-center">
          <StatusBadge status="draft" size="sm" />
          <span className="ml-2">Draft</span>
        </div>
      </DropdownMenuCheckboxItem>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        <p className="text-gray-600">Review and manage all student projects</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Projects ({projects.length})</CardTitle>
            <SearchAndFilter
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search projects..."
              filterContent={filterContent}
            />
          </div>
        </CardHeader>
        <CardContent>
          {sortedProjects.length > 0 ? (
            <div className="space-y-8">
              {/* Pending Projects Section */}
              {sortedProjects.some(
                (project) => project.status === "submitted"
              ) && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <StatusBadge status="submitted" />
                    <span className="ml-2">
                      Pending Review (
                      {
                        sortedProjects.filter((p) => p.status === "submitted")
                          .length
                      }
                      )
                    </span>
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedProjects
                      .filter((project) => project.status === "submitted")
                      .map((project) => (
                        <ProjectCard
                          key={project.id}
                          id={project.id}
                          name={project.name}
                          summary={project.summary}
                          programmingLanguages={project.programmingLanguages ?? []}
                          status={project.status}
                          totalEstimatedDays={project.total_estimated_days}
                          createdAt={project.created_at}
                          presentationDate={project.presentation_date}
                          studentName={project.profiles?.full_name}
                          isAdmin={true}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Other Projects Section */}
              {sortedProjects.some(
                (project) => project.status !== "submitted"
              ) && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Other Projects (
                    {
                      sortedProjects.filter((p) => p.status !== "submitted")
                        .length
                    }
                    )
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedProjects
                      .filter((project) => project.status !== "submitted")
                      .map((project) => (
                        <ProjectCard
                          key={project.id}
                          id={project.id}
                          name={project.name}
                          summary={project.summary}
                          programmingLanguages={project.programmingLanguages ?? []}
                          status={project.status}
                          totalEstimatedDays={project.total_estimated_days}
                          createdAt={project.created_at}
                          presentationDate={project.presentation_date}
                          studentName={project.profiles?.full_name}
                          isAdmin={true}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-12 w-12 text-gray-400 mx-auto" />}
              title="No projects found"
              description={
                searchQuery || !statusFilter.includes("all")
                  ? "No projects match your current filters"
                  : "No projects have been created yet"
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
