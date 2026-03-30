import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import NotificationBell from './Notifications/NotificationBell';

interface DesktopNavProps {
  isLoggedIn: boolean;
  userRole: 'admin' | 'planner' | 'attendee' | null;
}

interface NavLink {
  href: string;
  label: string;
  public?: boolean;
  roles?: ('admin' | 'planner' | 'attendee')[];
}

const DesktopNav = ({ isLoggedIn, userRole }: DesktopNavProps) => {
  const { pathname } = useLocation();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const publicLinks: NavLink[] = [
    { href: '/events', label: 'Explore Events' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const userSpecificLinks: NavLink[] = [
    { href: '/my-tickets', label: 'My Tickets', roles: ['attendee'] },
    { href: '/dashboard', label: 'Portal', roles: ['admin', 'planner'] },
  ];

  const getFilteredLinks = () => {
    if (!isLoggedIn) return publicLinks;
    const links = [...publicLinks];
    const userLinks = userSpecificLinks.filter(link => 
      !link.roles || (userRole && link.roles.includes(userRole))
    );
    return [...links, ...userLinks];
  };

  const links = getFilteredLinks();

  return (
    <NavigationMenu className="max-w-max">
      <NavigationMenuList className="gap-1">
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                to={link.href}
                className="relative flex items-center px-4 py-2 text-sm font-medium transition-all group"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className={`relative z-10 transition-colors duration-300 ${pathname === link.href ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'}`}>
                  {link.label}
                </span>
                
                {hoveredLink === link.href && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-primary/5 border border-primary/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-active-bar"
                    className="absolute -bottom-[26px] left-4 right-4 h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        {/* User Actions */}
        <NavigationMenuItem className="ml-4 flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border border-border/50 hover:bg-primary/10 transition-all p-0">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass-effect animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {userRole ? userRole[0].toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Authenticated User</span>
                      <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer gap-2">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 rounded-xl px-5 font-bold uppercase tracking-wider text-[10px] border border-primary/20 transition-all hover:scale-[1.02]">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl px-6 font-bold uppercase tracking-wider text-[10px] hover:scale-[1.02]">
                <Link to="/register">Join</Link>
              </Button>
            </div>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;