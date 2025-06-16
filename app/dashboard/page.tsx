"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/project-card";
import { EventCard } from "@/components/cards/event-card";
import { LoadingSpinner } from "@/components/utils/loading-spinner";
import { ErrorMessage } from "@/components/utils/error-message";
import { EmptyState } from "@/components/cards/empty-state";
import Link from "next/link";
import { Calendar, FolderPlus, FileText } from "lucide-react";

type Project = {
  id: string;
  name: string;
  summary: string;
  status: string;
  total_estimated_days: number;
  created_at: string;
  presentation_date: string | null;
  student_id: string;
  programming_languages?: string[];
  profiles?: {
    full_name: string;
    email: string;
  };
};

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
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [talks, setTalks] = useState<Event[]>([]);
  const [workshops, setWorkshops] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch projects with proper error handling
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          *
        `
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("Projects error:", projectsError);
      } else {
        setProjects(projectsData || []);
      }

      // Fetch talks and conferences (including user_groups should go to workshops)
      const { data: talksData, error: talksError } = await supabase
        .from("events")
        .select("*")
        .in("event_type", ["talk", "conference"]) // Removed user_group from here
        .eq("status", "approved")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (talksError) {
        console.error("Talks error:", talksError);
      } else {
        setTalks(talksData || []);
      }

      // Fetch workshops and user groups
      const { data: workshopsData, error: workshopsError } = await supabase
        .from("events")
        .select("*")
        .in("event_type", ["workshop", "user_group"])
        .eq("status", "approved")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (workshopsError) {
        console.error("Workshops error:", workshopsError);
      } else {
        setWorkshops(workshopsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (!profile) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h2>
          <p className="text-gray-600">Take a look at the ongoing activities!</p>
        </div>
        {profile?.role === "student" && (
          <div className="flex gap-2">
            <Link href="/dashboard/new-project">
              <Button className="bg-purple-200 hover:bg-purple-300 text-purple-800 rounded-xl">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
            <Link href="/dashboard/presentations/new">
              <Button
                variant="outline"
                className="text-gray-800 hover:bg-purple-400 hover:text-purple-100 rounded-xl"
              >
                <Calendar className="h-4 w-4 mr-2 " />
                Schedule Presentation
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Section 1: Free Projects (All Students' Projects) */}
      <Card>
        <CardHeader>
          <CardTitle>Ongoing Free Projects</CardTitle>
          <CardDescription>
            Browse all available student projects and get inspired by their work!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    summary={project.summary}
                    programmingLanguages={project.programming_languages || []}
                    status={project.status}
                    totalEstimatedDays={project.total_estimated_days}
                    createdAt={project.created_at}
                    presentationDate={project.presentation_date}
                    studentName={project.profiles?.full_name}
                    isAdmin={profile?.role === "admin"}
                  />
                ))}
              </div>
              {projects.length > 6 && (
                <div className="mt-6 text-center">
                  <Link href="/dashboard/projects">
                    <Button variant="outline">View All Projects</Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={<FileText className="h-12 w-12 text-gray-400 mx-auto" />}
              title="No approved projects yet"
              description="Check back later for new projects from students"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 2: Upcoming Talks and Conferences */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Talks & Conferences</CardTitle>
            <CardDescription>
              Stay updated with the latest talks and conferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            {talks.length > 0 ? (
              <div className="space-y-4">
                {talks.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                {talks.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link href="/dashboard/events">
                      <Button variant="outline" size="sm">
                        View all talks
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                title="No upcoming talks or conferences"
                description="Check back later for new events"
                action={
                  profile?.role === "student"
                    ? {
                        label: "Schedule a Talk",
                        onClick: () =>
                          (window.location.href =
                            "/dashboard/presentations/new"),
                      }
                    : undefined
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Section 3: Upcoming Workshops and User Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Workshops & User Groups</CardTitle>
            <CardDescription>
              Enhance your skills with these workshops and user groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workshops.length > 0 ? (
              <div className="space-y-4">
                {workshops.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                {workshops.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link href="/dashboard/events">
                      <Button variant="outline" size="sm">
                        View all workshops
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                title="No upcoming workshops or user groups"
                description="Check back later for new events"
                action={
                  profile?.role === "admin"
                    ? {
                        label: "Create Workshop",
                        onClick: () =>
                          (window.location.href = "/dashboard/events/new"),
                      }
                    : undefined
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
