"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StorageSetupPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (profile && profile.role !== "admin") {
      router.push("/dashboard");
    }
  }, [profile, router]);

  const createBucket = async () => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase.storage.createBucket(
        "presentations",
        {
          public: true,
          fileSizeLimit: 10485760, // 10MB in bytes
        }
      );

      if (error) {
        throw error;
      }

      setResult("Storage bucket 'presentations' created successfully!");
      toast({
        title: "Success",
        description: "Storage bucket created successfully",
      });
    } catch (error: any) {
      console.error("Error creating bucket:", error);
      setResult(`Error: ${error.message || "Unknown error"}`);
      toast({
        title: "Error",
        description: error.message || "Failed to create storage bucket",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!profile || profile.role !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Storage Setup</h2>
        <p className="text-gray-600">
          Create required storage buckets for the application
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Storage Bucket</CardTitle>
          <CardDescription>
            Create the required storage bucket for file uploads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This utility will create the "presentations" storage bucket in your
            Supabase project. You only need to run this once.
          </p>
          <Button onClick={createBucket} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Bucket"}
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">{result}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
