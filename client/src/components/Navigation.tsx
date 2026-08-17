import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

interface NavigationProps {
  isLoggedIn?: boolean;
  userRole?: 'admin' | 'planner' | 'attendee' | null;
}

const Navigation = ({ isLoggedIn = false, userRole = null }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const navbarWidth = useTransform(scrollY, [0, 50], ['100%', '92%']);
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <motion.nav
        style={{
          width: navbarWidth,
          opacity: navbarOpacity,
        }}
        className="sticky top-0 z-50 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] left-0 right-0 mx-auto transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0 flex items-center gap-2 group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
                  <img 
                    src="https://res.cloudinary.com/fffb5ery/image/upload/v1784291927/Smart_Ticketing_Logo_cw5utb.png" 
                    alt="Smart Ticketing" 
                    className="h-10 w-auto relative z-10 brightness-110 contrast-125"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
                  SmartTicketing
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <DesktopNav isLoggedIn={isLoggedIn} userRole={userRole} />
              <div className="h-6 w-[1px] bg-border/50 mx-2" />
              <ThemeToggle />
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-white/20 dark:hover:bg-black/20"
              >
                <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}>
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
    </>
  );
};

export default Navigation;