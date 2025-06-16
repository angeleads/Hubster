import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Navbar() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (!user || !profile) {
    return null;
  }

  const isAdmin = profile.role === "admin";
  return (
    <nav className="bg-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 py-4 justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-purple-200">Hubster</h1>
          </div>
          <div className="flex items-center space-x-4">
            <User className="h-4 w-4 text-purple-50" />
            <span className="text-sm font-bold text-purple-50">
              {profile?.full_name}
            </span>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                isAdmin
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {profile?.role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
