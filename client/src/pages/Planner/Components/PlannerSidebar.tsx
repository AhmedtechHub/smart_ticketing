import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "@/api/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  Ticket,
  PlusCircle,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Archive,
  Star,
  MessageSquare,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navigation = [
  {
    title: "Intelligence",
    items: [
      { name: "My Dashboard", icon: LayoutDashboard, href: "/planner", exact: true, badge: null },
      { name: "Event Insights",  icon: Star,       href: "/planner/insights",         badge: "New" },
    ],
  },
  {
    title: "Experiences",
    items: [
      { name: "Organize Event", icon: PlusCircle,      href: "/planner/create",          badge: null },
      { name: "Active Events",  icon: CalendarCheck, href: "/planner/events",          badge: null },
      { name: "Archive Box",   icon: Archive,       href: "/planner/archived", badge: null },
    ],
  },
  {
    title: "Inventory",
    items: [
      { name: "Ticket Tiers",      icon: Ticket, href: "/planner/tickets",          badge: null  },
      { name: "Attendee List",    icon: Users,  href: "/planner/attendees",        badge: null  },
    ],
  },
  {
    title: "Financials",
    items: [
      { name: "Payouts",    icon: CreditCard, href: "/planner/payouts",               badge: null },
    ],
  },
  {
    title: "Connect",
    items: [
      { name: "Notifications", icon: Bell,          href: "/planner/notifications", badge: "2" },
      { name: "Support Hub",      icon: MessageSquare, href: "/planner/support",      badge: null },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Planner Settings", icon: Settings, href: "/planner/settings", badge: null },
    ],
  },
];

const PlannerSidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  
  const user = session?.user;
  const plannerName = user?.name || "Event Planner";
  const plannerEmail = user?.email || "planner@smarttick.io";
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

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 272 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-50 h-screen flex flex-col
                 bg-sidebar border-r border-sidebar-border
                 text-sidebar-foreground font-sans overflow-hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-lg">
                P
              </span>
              <span className="text-base font-semibold tracking-tight text-sidebar-foreground whitespace-nowrap">
                Planner Hub
              </span>
            </motion.div>
          ) : (
            <motion.span
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg"
            >
              P
            </motion.span>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 shrink-0 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-3 mt-4 mb-2 rounded-xl bg-sidebar-accent p-3 flex items-center gap-3 overflow-hidden"
          >
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-sidebar-primary/30">
              <AvatarImage src={(user as any)?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${plannerName}`} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">{plannerName}</p>
              <p className="text-xs text-sidebar-accent-foreground truncate">{plannerEmail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-4">
        <TooltipProvider delayDuration={0}>
          {navigation.map((section) => (
            <div key={section.title}>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 select-none"
                  >
                    {section.title}
                  </motion.p>
                )}
              </AnimatePresence>

              <ul className="space-y-0.5">
                {section.items.map((item: any) => {
                  const isActive = item.exact
                    ? location.pathname === item.href
                    : location.pathname.startsWith(item.href);

                  return (
                    <li key={item.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink
                            to={item.href}
                            end={item.exact}
                            className={`
                              group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                              transition-colors duration-150 outline-none
                              ${isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                              ${collapsed ? "justify-center px-0" : ""}
                            `}
                          >
                            <item.icon className="h-[18px] w-[18px] shrink-0" />

                            {!collapsed && (
                              <span className="flex-1 truncate">{item.name}</span>
                            )}

                            {!collapsed && item.badge && (
                              <Badge
                                variant={isActive ? "secondary" : "outline"}
                                className={`ml-auto text-[10px] px-1.5 py-0 font-semibold ${
                                  isActive
                                    ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground border-0"
                                    : "border-sidebar-border text-sidebar-accent-foreground"
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}

                            {collapsed && item.badge && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        </TooltipTrigger>

                        {collapsed && (
                          <TooltipContent side="right" sideOffset={8} className="font-sans">
                            <span>{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </TooltipProvider>
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={`w-full rounded-lg text-sm font-medium text-sidebar-foreground
                           hover:bg-destructive/10 hover:text-destructive transition-colors duration-150
                           ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"}`}
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={8}>Logout</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.aside>
  );
};

export default PlannerSidebar;
