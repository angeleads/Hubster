import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PresentationNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Presentation Not Found</h2>
      <p className="text-slate-400 mb-6">
        The presentation you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link href="/dashboard/presentations">
        <Button>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Presentations
        </Button>
      </Link>
    </div>
  );
}
