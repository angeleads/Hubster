import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  if (!user || !profile) {
    return null;
  }

  const initials = profile.full_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="bg-neutral-800 backdrop-blur">
      <div className="max-w-full px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <img
              src="/hubecito-logo.png"
              alt="Hubicito Logo"
              className="h-36 w-h-36 mr-5"
            />
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden sm:block">
              <div className="rounded-lg bg-purple-100 text-purple-800 border-purple-200">
                <div className="text-xs m-2 font-bold">{profile.role}</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile.email}
                    </p>
                    {profile.tekx_position && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.tekx_position}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="bg-red-100 text-red-700 hover:bg-red-300 hover:text-red-900"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
