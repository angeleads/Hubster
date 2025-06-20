"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCardsList } from "@/components/cards/project-cards-list";
import Link from "next/link";
import { FolderPlus } from "lucide-react";

type Project = {
  id: string;
  name: string;
  summary: string;
  status: string;
  total_estimated_days: number;
  created_at: string;
  presentation_date: string;
  programming_language?: string[];
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ProjectCardsList
            projects={projects}
            emptyMessage="You haven't created any projects yet"
          />
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <ProjectCardsList
            projects={projects}
            status="draft"
            emptyMessage="You don't have any draft projects"
          />
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <ProjectCardsList
            projects={projects}
            status="submitted"
            emptyMessage="You don't have any submitted projects"
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <ProjectCardsList
            projects={projects}
            status="approved"
            emptyMessage="You don't have any approved projects"
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <ProjectCardsList
            projects={projects}
            status="completed"
            emptyMessage="You don't have any completed projects"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
