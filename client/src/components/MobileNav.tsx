import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Ticket, LayoutDashboard, Home, Search, CreditCard, LogOut } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userRole: 'admin' | 'planner' | 'attendee' | null;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: ('admin' | 'planner' | 'attendee')[];
}

const MobileNav = ({ isOpen, onClose, isLoggedIn, userRole }: MobileNavProps) => {
  const { pathname } = useLocation();

  const links: NavLink[] = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { href: '/events', label: 'Explore', icon: <Search className="h-5 w-5" /> },
    { href: '/pricing', label: 'Pricing', icon: <CreditCard className="h-5 w-5" /> },
    { href: '/my-tickets', label: 'Tickets', icon: <Ticket className="h-5 w-5" />, roles: ['attendee'] },
    { href: '/dashboard', label: 'Portal', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['admin', 'planner'] },
  ];

  const filteredLinks = links.filter(link => 
    !link.roles || (userRole && link.roles.includes(userRole))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Futuristic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
            onClick={onClose}
          />

          {/* Side Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-background/95 backdrop-blur-2xl z-[70] shadow-2xl border-l border-white/10"
          >
            <div className="flex flex-col h-full p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://res.cloudinary.com/dvkt0lsqb/image/upload/v1773771501/Smart_Ticketing_Logo_o9qzbh.png" 
                    alt="Logo" 
                    className="h-8 w-auto"
                  />
                  <span className="font-bold text-lg">SmartTicketing</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-2">
                {filteredLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                  >
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        pathname === link.href 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.icon}
                      <span className="font-semibold">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto space-y-4">
                {isLoggedIn ? (
                  <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {userRole ? userRole[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">Account Managed</p>
                        <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/10" onClick={onClose}>
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 rounded-2xl font-bold uppercase tracking-wider text-[10px]" asChild>
                      <Link to="/login" onClick={onClose}>Login</Link>
                    </Button>
                    <Button className="h-12 rounded-2xl shadow-xl shadow-primary/20 font-bold uppercase tracking-wider text-[10px]" asChild>
                      <Link to="/register" onClick={onClose}>Join</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;