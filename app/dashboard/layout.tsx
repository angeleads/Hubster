"use client";

import type React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarAdmin from "@/components/dashboard/sidebar/sidebar-admin";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isAdmin ? "Astek Panel" : "My Dashboard"}
                </h2>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {isAdmin ? <SidebarAdmin /> : <SidebarStudent />}
              </nav>
            </div>
          </div>
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