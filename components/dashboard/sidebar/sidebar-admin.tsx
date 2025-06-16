import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderOpen, Presentation } from "lucide-react";

export default function SidebarAdmin() {
  return (
    <>
      <Link href="/dashboard/admin/projects">
        <Button
          variant="ghost"
          className="w-full justify-start text-purple-50 hover:bg-purple-200"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          All Projects
        </Button>
      </Link>
      <Link href="/dashboard/admin/presentations">
        <Button
          variant="ghost"
          className="w-full justify-start text-purple-50 hover:bg-purple-200"
        >
          <Presentation className="h-4 w-4 mr-2" />
          Presentations
        </Button>
      </Link>
    </>
  );
}
