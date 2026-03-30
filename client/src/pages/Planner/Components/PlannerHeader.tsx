import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/api/apiConfig";
import {
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import NotificationBell from "@/components/Notifications/NotificationBell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const PlannerHeader = ({ collapsed: _collapsed, setCollapsed: _setCollapsed }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const plannerName = user?.name || "Event Planner";
  const initials = plannerName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between
                       border-b border-border bg-background/80 backdrop-blur-xl
                       px-4 sm:px-6 font-sans">

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search projects, sales, insights…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64 rounded-lg border-border bg-muted/50 pl-9 pr-4
                       text-sm placeholder:text-foreground
                       focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Project</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications */}
        <NotificationBell />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDarkMode ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg px-2 py-1 h-auto
                         hover:bg-accent hover:text-accent-foreground"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src={(user as any)?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${plannerName}`} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-none text-foreground">{plannerName}</p>
                <p className="text-xs text-foreground mt-0.5">Planner Hub</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 font-sans">
            <DropdownMenuLabel className="font-semibold text-xs tracking-widest uppercase opacity-100 text-foreground">Manage Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/planner/settings')}>
              <User className="h-4 w-4 text-foreground" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/planner/settings')}>
              <Settings className="h-4 w-4 text-foreground" /> Hub Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/planner/support')}>
              <HelpCircle className="h-4 w-4 text-foreground" /> Get Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};

export default PlannerHeader;
