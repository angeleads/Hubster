"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PresentationCardAdmin } from "@/components/cards/presentation-card-admin";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type Event = {
  id: string;
  title: string;
  description: string;
  event_type: "talk" | "workshop" | "conference" | "hackathon";
  start_date: string;
  end_date: string;
  location: string;
  presenter_id: string;
  presenter_name: string;
  status: "pending" | "approved" | "rejected";
  file_url: string | null;
  admin_feedback: string | null;
  completed: boolean;
  created_at: string;
};

export default function AdminPresentationsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["all"]);
  const [typeFilter, setTypeFilter] = useState<string[]>(["all"]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (profile) {
      if (!["admin", "super_admin"].includes(profile.role)) {
        router.push("/dashboard");
        return;
      }
      fetchEvents();
    }
  }, [profile, router]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: rawData, error } = await supabase
        .from("events")
        .select("*, presenter:presenter_id(full_name)")
        .order("start_date", { ascending: true });

      if (error) {
        throw error;
      }

      const data = rawData.map((event: any) => ({
        ...event,
        presenter_name:
          typeof event.presenter === "object" &&
          event.presenter !== null &&
          "full_name" in event.presenter
            ? event.presenter.full_name
            : "N/A",
      }));

      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError("Failed to load presentations. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load presentations",
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

  const handleTypeFilterChange = (type: string) => {
    if (type === "all") {
      setTypeFilter(["all"]);
      return;
    }

    const newFilter = typeFilter.filter((t) => t !== "all");

    if (newFilter.includes(type)) {
      const filtered = newFilter.filter((t) => t !== type);
      setTypeFilter(filtered.length === 0 ? ["all"] : filtered);
    } else {
      setTypeFilter([...newFilter, type]);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.presenter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter.includes("all") || statusFilter.includes(event.status);
    const matchesType =
      typeFilter.includes("all") || typeFilter.includes(event.event_type);

    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  if (loading) {
    return <LoadingSpinner message="Loading presentations..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchEvents} />;
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
        checked={statusFilter.includes("pending")}
        onCheckedChange={() => handleStatusFilterChange("pending")}
      >
        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("approved")}
        onCheckedChange={() => handleStatusFilterChange("approved")}
      >
        <Badge className="bg-green-100 text-green-800">Approved</Badge>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={statusFilter.includes("rejected")}
        onCheckedChange={() => handleStatusFilterChange("rejected")}
      >
        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      </DropdownMenuCheckboxItem>

      <DropdownMenuSeparator />
      <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={typeFilter.includes("all")}
        onCheckedChange={() => setTypeFilter(["all"])}
      >
        All Types
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={typeFilter.includes("talk")}
        onCheckedChange={() => handleTypeFilterChange("talk")}
      >
        <Badge className="bg-blue-100 text-blue-800">Talk</Badge>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={typeFilter.includes("workshop")}
        onCheckedChange={() => handleTypeFilterChange("workshop")}
      >
        <Badge className="bg-green-100 text-green-800">Workshop</Badge>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={typeFilter.includes("conference")}
        onCheckedChange={() => handleTypeFilterChange("conference")}
      >
        <Badge className="bg-purple-100 text-purple-800">Conference</Badge>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={typeFilter.includes("hackathon")}
        onCheckedChange={() => handleTypeFilterChange("hackathon")}
      >
        <Badge className="bg-pink-100 text-pink-800">Hackathons</Badge>
      </DropdownMenuCheckboxItem>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm  flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          Presentation Management
        </h2>
        <p className="text-gray-600">
          Review and manage all presentations and events
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Presentations ({events.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {sortedEvents.length > 0 ? (
            <div className="space-y-8">
              {/* Pending Presentations Section */}
              {sortedEvents.some((event) => event.status === "pending") && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Pending Review
                    </Badge>
                    <span className="ml-2">
                      (
                      {
                        sortedEvents.filter((e) => e.status === "pending")
                          .length
                      }
                      )
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {sortedEvents
                      .filter((event) => event.status === "pending")
                      .map((event) => (
                        <PresentationCardAdmin
                          key={event.id}
                          event={event}
                          isAdmin={true}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Approved Presentations Section */}
              {sortedEvents.some(
                (event) => event.status === "approved" && !event.completed
              ) && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Badge className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                    <span className="ml-2">
                      (
                      {
                        sortedEvents.filter(
                          (e) => e.status === "approved" && !e.completed
                        ).length
                      }
                      )
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {sortedEvents
                      .filter(
                        (event) =>
                          event.status === "approved" && !event.completed
                      )
                      .map((event) => (
                        <div key={event.id} className="relative">
                          <PresentationCardAdmin event={event} isAdmin={true} />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Other Presentations Section */}
              {sortedEvents.some(
                (event) =>
                  event.status !== "pending" &&
                  (event.status !== "approved" || event.completed)
              ) && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Other Presentations (
                    {
                      sortedEvents.filter(
                        (e) =>
                          e.status !== "pending" &&
                          (e.status !== "approved" || e.completed)
                      ).length
                    }
                    )
                  </h3>
                  <div className="space-y-4">
                    {sortedEvents
                      .filter(
                        (event) =>
                          event.status !== "pending" &&
                          (event.status !== "approved" || event.completed)
                      )
                      .map((event) => (
                        <PresentationCardAdmin
                          key={event.id}
                          event={event}
                          isAdmin={true}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-12 w-12 text-gray-400 mx-auto" />}
              title="No presentations found"
              description={
                searchQuery ||
                !statusFilter.includes("all") ||
                !typeFilter.includes("all")
                  ? "No presentations match your current filters"
                  : "No presentations have been submitted yet"
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
