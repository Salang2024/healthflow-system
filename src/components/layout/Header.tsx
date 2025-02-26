
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  // TODO: Replace with actual user data when authentication is implemented
  const userName = "Dr. Smith"; 

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="ml-2">Dashboard</span>
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Implement logout functionality
              console.log("Logout clicked");
            }}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
