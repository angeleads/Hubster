"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/project-card";
import { EventCard } from "@/components/cards/event-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Calendar,
  FolderPlus,
  FileText,
  TrendingUp,
  CircleCheckBig,
  Clock,
} from "lucide-react";

type Project = {
  id: string
  title: string
  description: string | null
  status: string
  created_at: string
  submitted_at: string | null
  user_id: string
  timeline_estimate: string
  likes_count: number
  profiles?: {
    full_name: string
    email: string
  }
}

type Event = {
  id: string
  title: string
  description: string | null
  event_type: "talk" | "workshop" | "conference" | "hackathon"
  status: string
  created_at: string
  start_date: string
  end_date: string
  duration_minutes: number
  location: string | null
  presenter_id: string
  profiles?: {
    full_name: string
  }
}


type DashboardStats = {
  totalProjects: number;
  approvedProjects: number;
  pendingProjects: number;
  upcomingEvents: number;
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Event[]>([]);
  const [hackathons, setHackathons] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    approvedProjects: 0,
    pendingProjects: 0,
    upcomingEvents: 0,
  });
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
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`*`)
        .in("status", ["approved", "completed", "in_progress"])
        .order("created_at", { ascending: false })
        .limit(6);

      if (projectsError) {
        console.error("Projects error:", projectsError);
      } else {
        setProjects(projectsData || []);
      }

      // Fetch sessions (talks, conferences, workshops)
      const { data: sessionData, error: sessionError } = await supabase
        .from("events")
        .select("*")
        .in("event_type", ["talk", "conference", "workshop"])
        .in("status", ["approved", "completed", "in_progress"])
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(3);

      if (sessionError) {
        console.error("Talks error:", sessionError);
      } else {
        setSessions(sessionData || []);
      }

       // Fetch hackathons and user groups
      const { data: hackathonsData, error: hackathonsError } = await supabase
        .from("events")
        .select("*")
        .in("event_type", ["hackathon"])
        .in("status", ["approved", "completed", "in_progress"])
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(3);

      if (hackathonsError) {
        console.error("Hackathons error:", hackathonsError);
      } else {
        setHackathons(hackathonsData || []);
      }

      // Fetch dashboard stats
      const [projectsCount, eventsCount] = await Promise.all([
        supabase.from("projects").select("status", { count: "exact" }),
        supabase
          .from("events")
          .select("*", { count: "exact" })
          .in("status", ["approved", "completed", "in_progress"])
          .gte("start_date", new Date().toISOString()),
      ]);

      if (projectsCount.data) {
        const approved = projectsCount.data.filter(
          (p) => p.status === "approved"
        ).length;
        const pending = projectsCount.data.filter(
          (p) => p.status === "submitted"
        ).length;

        setStats({
          totalProjects: projectsCount.count || 0,
          approvedProjects: approved,
          pendingProjects: pending,
          upcomingEvents: eventsCount.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (!profile) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const isAdmin = profile.role === "admin";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${profile.full_name}`}
        description="Here's what's happening with your projects and events"
      >
        {profile.role === "student" && (
          <div className="flex gap-3">
            <Link href="/dashboard/new-project">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
            <Link href="/dashboard/presentations/new">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Presentation
              </Button>
            </Link>
          </div>
        )}
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-blue-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg shadow-sm hover:shadow-blue-600">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-green-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CircleCheckBig className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approvedProjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-amber-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingProjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-purple-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcomingEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Link
            href={
              isAdmin ? "/dashboard/admin/projects" : "/dashboard/my-projects"
            }
          >
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  status={project.status}
                  timelineEstimate={project.timeline_estimate}
                  createdAt={project.created_at}
                  submittedAt={project.submitted_at}
                  studentName={project.profiles?.full_name}
                  likesCount={project.likes_count}
                  isAdmin={profile?.role === "admin" || profile?.role === "super_admin"}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-12 w-12 text-gray-400" />}
              title="No approved projects yet"
              description="Come back later for new projects from students"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Link href="/dashboard/presentations">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming event"
                description="Come back later for new events"
                action={
                  profile.role === "student"
                    ? {
                        label: "Schedule an event",
                        onClick: () =>
                          (window.location.href =
                            "/dashboard/presentations/new"),
                        variant: "outline",
                      }
                    : undefined
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Upcoming Workshops */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Hackathons</CardTitle>
            <Link href="/dashboard/presentations">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {hackathons.length > 0 ? (
              <div className="space-y-4">
                {hackathons.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming hackathons"
                description="Come back later for new events"
                action={
                  profile.role === "admin"
                    ? {
                        label: "Create Workshop",
                        onClick: () =>
                          (window.location.href = "/dashboard/events/new"),
                        variant: "outline",
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