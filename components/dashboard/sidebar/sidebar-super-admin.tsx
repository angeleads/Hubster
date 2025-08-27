"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Presentation,
  LayoutDashboard,
  BookUser,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Admin Management", href: "/dashboard/super-admin/admin-management", icon: BookUser },
  { name: "All Projects", href: "/dashboard/admin/projects", icon: FolderOpen },
  { name: "Presentations", href: "/dashboard/admin/presentations", icon: Presentation },
];

export default function SidebarSuperAdmin({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-1">
      {/* Bouton toggle en haut de la sidebar */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 justify-end bg-transparent hover:bg-transparent"
        aria-label={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
      >
        <Menu className="h-5 w-5 text-white" />
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
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "text-gray-100 hover:bg-purple-50 hover:text-gray-800"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  !collapsed && "mr-3"
                )}
              />
              {!collapsed && item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
