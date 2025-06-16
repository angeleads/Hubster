import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function SidebarSettings() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };
  return (
    <div className="flex flex-col mt-auto">
        <Link href="/dashboard">
            <Button
            variant="ghost"
            className="w-full justify-start text-purple-50 hover:bg-purple-200"
            >
            <Settings className="h-4 w-4 mr-2" />
            Settings
            </Button>
        </Link>
        <Button
            variant="ghost"
            className="w-full justify-start text-purple-50 hover:bg-purple-200"
            onClick={handleSignOut}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
        </Button>
    </div>
  );
}
