import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "@/api/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  Ticket,
  Users,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Archive,
  BarChart3,
  Shield,
  Image,
  Mail,
  Clock,
  MessageSquare,
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
    title: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/admin", exact: true, badge: null },
      { name: "Analytics",  icon: BarChart3,       href: "/admin/analytics",         badge: "Beta" },
    ],
  },
  {
    title: "Event Management",
    items: [
      { name: "All Events",        icon: CalendarCheck, href: "/admin/events",          badge: null },
      { name: "Pending Approvals", icon: Sparkles,      href: "/admin/approvals",       badge: "12" },
      { name: "Archived Events",   icon: Archive,       href: "/admin/events/archived", badge: null },
      { name: "Schedule Manager",  icon: Clock,         href: "/admin/schedule",        badge: null },
    ],
  },
  {
    title: "Ticket Management",
    items: [
      { name: "All Tickets",      icon: Ticket, href: "/admin/tickets",          badge: null  },
      { name: "Ticket Generator", icon: Image,  href: "/admin/tickets/generate", badge: "PNG" },
      { name: "Ticket Gallery",   icon: Image,  href: "/admin/tickets/gallery",  badge: null  },
    ],
  },
  {
    title: "User Management",
    items: [
      { name: "All Users",      icon: Users,  href: "/admin/users",          badge: null  },
    ],
  },
  {
    title: "Payments",
    items: [
      { name: "All Transactions", icon: CreditCard, href: "/admin/payments",               badge: null },
      { name: "Disbursements",    icon: CreditCard, href: "/admin/payments/disbursements",  badge: null },
    ],
  },
  {
    title: "Communications",
    items: [
      { name: "Notifications", icon: Bell,          href: "/admin/notifications", badge: "3" },
      { name: "Broadcast",     icon: Mail,          href: "/admin/broadcast",     badge: null },
      { name: "Messages",      icon: MessageSquare, href: "/admin/messages",      badge: null },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "System Settings", icon: Settings, href: "/admin/settings", badge: null },
    ],
  },
];

const AdminSidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  
  const user = session?.user;
  const adminName = user?.name || "System Admin";
  const adminEmail = user?.email || "admin@smarttick.io";
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

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 272 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-50 h-screen flex flex-col
                 bg-sidebar border-r border-sidebar-border
                 text-sidebar-foreground font-sans overflow-hidden"
    >
      {/* ── Logo / Collapse Toggle ─────────────────────────── */}
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
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                A
              </span>
              <span className="text-base font-semibold tracking-tight text-sidebar-foreground whitespace-nowrap">
                Admin Panel
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
              A
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

      {/* ── Admin Profile ─────────────────────────────────── */}
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
              <AvatarImage src={(user as any)?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${adminName}`} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">{adminName}</p>
              <p className="text-xs text-sidebar-accent-foreground truncate">{adminEmail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-4">
        <TooltipProvider delayDuration={0}>
          {navigation.map((section) => (
            <div key={section.title}>
              {/* Section heading */}
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground select-none"
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
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
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

      {/* ── Logout ────────────────────────────────────────── */}
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

export default AdminSidebar;