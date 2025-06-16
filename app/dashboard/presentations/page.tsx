"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/cards/event-card";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

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
  status: "pending" | "approved" | "rejected";
};

export default function PresentationsPage() {
  const { profile } = useAuth();
  const [myPresentations, setMyPresentations] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchMyPresentations();
    }
  }, [profile]);

  const fetchMyPresentations = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("presenter_id", profile.id)
        .order("start_date", { ascending: true });

      if (error) throw error;
      setMyPresentations(data || []);
    } catch (error) {
      console.error("Error fetching presentations:", error);
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
          <h2 className="text-2xl font-bold text-gray-900">My Presentations</h2>
          <p className="text-gray-600">Manage your talks and user groups</p>
        </div>
        <Link href="/dashboard/presentations/new">
          <Button className="bg-purple-200 hover:bg-purple-300 text-purple-800">
            <Plus className="h-4 w-4 mr-2" />
            New Presentation
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPresentations
              .filter(
                (event) =>
                  new Date(event.start_date) > new Date() &&
                  event.status === "approved"
              )
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

            {myPresentations.filter(
              (event) =>
                new Date(event.start_date) > new Date() &&
                event.status === "approved"
            ).length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">
                  You don't have any upcoming presentations
                </p>
                <Link href="/dashboard/presentations/new">
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule a Presentation
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPresentations
              .filter(
                (event) =>
                  new Date(event.start_date) <= new Date() &&
                  event.status === "approved"
              )
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

            {myPresentations.filter(
              (event) =>
                new Date(event.start_date) <= new Date() &&
                event.status === "approved"
            ).length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  You don't have any past presentations
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPresentations
              .filter((event) => event.status === "pending")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

            {myPresentations.filter((event) => event.status === "pending")
              .length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  You don't have any pending presentations
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
