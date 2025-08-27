import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Presentation,
  Puzzle,
  FileText,
  FolderPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Projects", href: "/dashboard/my-projects", icon: FileText },
  { name: "New Project", href: "/dashboard/new-project", icon: FolderPlus },
  {
    name: "My Presentations",
    href: "/dashboard/presentations",
    icon: Presentation,
  },
  { name: "What is Hub?", href: "/what-is-hub", icon: Puzzle },
];

export default function SidebarStudent() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive
                  ? "bg-purple-100 text-purple-700 hover:text-purple-700 hover:bg-purple-50"
                  : "text-gray-100 hover:bg-purple-50 hover:text-gray-800"
              )}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
