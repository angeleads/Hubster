"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading...</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-purple-600 hover:underline"
        >
          Taking too long? Click to refresh
        </button>
      </div>
    </div>
  )
}

  return null;
}
