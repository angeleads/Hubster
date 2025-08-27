"use client";

import type React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/dashboard/sidebar/sidebar-admin";
import SidebarSuperAdmin from "@/components/dashboard/sidebar/sidebar-super-admin";
import SidebarStudent from "@/components/dashboard/sidebar/sidebar-student";
import Navbar from "@/components/layout/navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // État partagé pour sidebar réduite ou non
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isAdmin = profile.role === "admin";
  const isSuperAdmin = profile.role === "super_admin";

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div
          className={`bg-zinc-800 border-r border-gray-200 hidden md:flex flex-col ${
            collapsed ? "w-16" : "w-64"
          } transition-width duration-300 ease-in-out`}
        >
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {isSuperAdmin ? (
              <SidebarSuperAdmin
                collapsed={collapsed}
                setCollapsed={setCollapsed}
              />
            ) : isAdmin ? (
              <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
            ) : (
              <SidebarStudent
                collapsed={collapsed}
                setCollapsed={setCollapsed}
              />
            )}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
