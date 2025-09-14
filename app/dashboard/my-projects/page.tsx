"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/cards/project-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import { FolderPlus } from "lucide-react"

type Project = {
  id: string
  title: string
  description: string | null
  status: string
  timeline_estimate: string
  created_at: string
  submitted_at: string | null
  likes_count: number
}

export default function MyProjectsPage() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      fetchProjects()
    }
  }, [profile])

  const fetchProjects = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Failed to load your projects")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProjects} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600">Manage your project submissions</p>
        </div>
        <div>
          <Link href="/dashboard/new-project">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <FolderPlus className="h-4 w-4 mr-2 " />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  status={project.status}
                  timelineEstimate={project.timeline_estimate}
                  createdAt={project.created_at}
                  submittedAt={project.submitted_at}
                  isDraft={project.status === "draft"}
                  likesCount={project.likes_count}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="No projects yet"
                  description="You haven't created any projects yet"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "draft").length > 0 ? (
              projects
                .filter((project) => project.status === "draft")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    timelineEstimate={project.timeline_estimate}
                    createdAt={project.created_at}
                    submittedAt={project.submitted_at}
                    isDraft={true}
                    likesCount={project.likes_count}
                  />
                ))
            ) : (
              <div className="col-span-full">
                <EmptyState title="No draft projects" description="You don't have any draft projects" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "submitted").length > 0 ? (
              projects
                .filter((project) => project.status === "submitted")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    timelineEstimate={project.timeline_estimate}
                    createdAt={project.created_at}
                    submittedAt={project.submitted_at}
                    likesCount={project.likes_count}
                  />
                ))
            ) : (
              <div className="col-span-full">
                <EmptyState title="No submitted projects" description="You don't have any submitted projects" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "approved" || project.status === "in_progress").length > 0 ? (
              projects
                .filter((project) => project.status === "approved" || project.status === "in_progress")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    timelineEstimate={project.timeline_estimate}
                    createdAt={project.created_at}
                    submittedAt={project.submitted_at}
                    likesCount={project.likes_count}
                  />
                ))
            ) : (
              <div className="col-span-full">
                <EmptyState title="No approved projects" description="You don't have any approved projects" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.filter((project) => project.status === "completed").length > 0 ? (
              projects
                .filter((project) => project.status === "completed")
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    timelineEstimate={project.timeline_estimate}
                    createdAt={project.created_at}
                    submittedAt={project.submitted_at}
                    likesCount={project.likes_count}
                  />
                ))
            ) : (
              <div className="col-span-full">
                <EmptyState title="No approved projects" description="You don't have any completed projects" />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
