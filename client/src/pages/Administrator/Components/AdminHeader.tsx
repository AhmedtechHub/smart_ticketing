import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/api/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings,
  User,
  LogOut,
  Shield,
  Calendar,
  ChevronDown,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Mail,
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

const AdminHeader = ({ collapsed: _collapsed, setCollapsed: _setCollapsed }: HeaderProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const adminName = user?.name || "System Admin";
  const adminRole = (user as any)?.role === 'ADMIN' ? 'System Administrator' : 'Event Planner';
  const initials = adminName.slice(0, 2).toUpperCase();

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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

      {/* ── Left ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search events, users, payments…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            className="h-9 w-72 rounded-lg border-border bg-muted/50 pl-9 pr-4
                       text-sm placeholder:text-muted-foreground
                       focus-visible:ring-1 focus-visible:ring-ring"
          />

          <AnimatePresence>
            {showResults && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 w-full rounded-xl border border-border
                           bg-popover text-popover-foreground shadow-lg p-2 z-50"
              >
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Events
                </p>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Tech Conference 202{i}</p>
                      <p className="text-xs text-muted-foreground">Mar {i * 5}, 2024</p>
                    </div>
                  </div>
                ))}
                <Separator className="my-1" />
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Users
                </p>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">John Doe {i}</p>
                      <p className="text-xs text-muted-foreground">john{i}@example.com</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1">

        {/* Messages badge */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => navigate('/admin/messages')} variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <Mail className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  3
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Messages</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications */}
        <NotificationBell />

        {/* Theme toggle */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDarkMode ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Fullscreen */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="hidden lg:flex h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Divider */}
        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg px-2 py-1 h-auto
                         hover:bg-accent hover:text-accent-foreground"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src={(user as any)?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${adminName}`} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-none text-foreground">{adminName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{adminRole}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 font-sans">
            <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/admin/settings')}>
              <User className="h-4 w-4 text-muted-foreground" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/admin/settings')}>
              <Settings className="h-4 w-4 text-muted-foreground" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/admin/settings')}>
              <Shield className="h-4 w-4 text-muted-foreground" /> Admin Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};

export default AdminHeader;