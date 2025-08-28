"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Presentation,
  Puzzle,
  FileText,
  FolderPlus,
  ArrowLeft,
  ArrowRight
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

export default function SidebarStudent({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-1">
      <Button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 justify-end bg-transparent hover:bg-transparent"
        aria-label={collapsed ? "Deploy the sidebar" : "Reduce the sidebar"}
      >
        {collapsed ? (
          <ArrowRight className="h-5 w-5 text-white" />
        ) : (
          <ArrowLeft className="h-5 w-5 text-white" />
        )}
      </Button>

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
              <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
