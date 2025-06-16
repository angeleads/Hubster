"use client";

import type React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SidebarAdmin from "@/components/dashboard/sidebar/sidebar-admin";
import SidebarStudent from "@/components/dashboard/sidebar/sidebar-student";
import SidebarSettings from "@/components/dashboard/sidebar/sidebar-settings";
import Navbar from "@/components/Navbar";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isAdmin = profile.role === "admin";

  return (
    <div className="min-h-screen bg-purple-950">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)] ">
        {/* Sidebar */}
        <div className="w-64 bg-purple-950 shadow-r-xl p-4 hidden md:block rounded-l-3xl">
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-50 hover:bg-purple-200"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                HUB
              </Button>
            </Link>

            {isAdmin ? (
              // Admin navigation
              <SidebarAdmin />
            ) : (
              // Student navigation
              <SidebarStudent />
            )}
          </div>
          <SidebarSettings />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-purple-50 rounded-3xl">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
