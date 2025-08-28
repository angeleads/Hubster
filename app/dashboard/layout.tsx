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
import { ArrowRight } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
  if (!user || !profile) return null;

  const isAdmin = profile.role === "admin";
  const isSuperAdmin = profile.role === "super_admin";

  const Sidebar =
    isSuperAdmin
      ? SidebarSuperAdmin
      : isAdmin
      ? SidebarAdmin
      : SidebarStudent;

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)] relative">
        <div
          className={`bg-zinc-800 border-r border-gray-200 hidden md:flex flex-col ${
            collapsed ? "w-16" : "w-64"
          } transition-width duration-300 ease-in-out`}
        >
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </nav>
        </div>

        <button
          type="button"
          className="fixed top-5 left-4 z-40 md:hidden flex items-center p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 focus:outline-none"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <ArrowRight className="h-4 w-4 text-white" />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative bg-zinc-800 h-full w-64 flex flex-col">
              <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                <Sidebar
                  collapsed={false}
                  setCollapsed={() => {}}
                  onCloseMobileSidebar={() => setMobileOpen(false)}
                />
              </nav>
            </aside>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
