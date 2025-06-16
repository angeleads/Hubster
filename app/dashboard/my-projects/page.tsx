"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FolderPlus } from "lucide-react";

type Project = {
  id: string;
  name: string;
  summary: string;
  status: string;
  total_estimated_days: number;
  created_at: string;
  presentation_date: string | null;
};

export default function MyProjectsPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchProjects();
    }
  }, [profile]);

  const fetchProjects = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("student_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600">Manage your project submissions</p>
        </div>
        <Link href="/dashboard/new-project">
          <Button className="bg-purple-200 hover:bg-purple-300 text-purple-800">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  summary={project.summary}
                  status={project.status}
                  totalEstimatedDays={project.total_estimated_days}
                  createdAt={project.created_at}
                  presentationDate={project.presentation_date}
                  isDraft={project.status === "draft"}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven't created any projects yet
                </p>
                <Link href="/dashboard/new-project">
                  <Button>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "draft").length >
            0 ? (
              projects
                .filter((project) => project.status === "draft")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    summary={project.summary}
                    status={project.status}
                    totalEstimatedDays={project.total_estimated_days}
                    createdAt={project.created_at}
                    presentationDate={project.presentation_date}
                    isDraft={true}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  You don't have any draft projects
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "submitted")
              .length > 0 ? (
              projects
                .filter((project) => project.status === "submitted")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    summary={project.summary}
                    status={project.status}
                    totalEstimatedDays={project.total_estimated_days}
                    createdAt={project.created_at}
                    presentationDate={project.presentation_date}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  You don't have any submitted projects
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "approved")
              .length > 0 ? (
              projects
                .filter((project) => project.status === "approved")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    summary={project.summary}
                    status={project.status}
                    totalEstimatedDays={project.total_estimated_days}
                    createdAt={project.created_at}
                    presentationDate={project.presentation_date}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  You don't have any approved projects
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
