import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Mail, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border/50 py-24 overflow-hidden font-sans">
      {/* Decorative background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--primary)/2%_1px,transparent_1px)] [background-size:32px_32px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
                <img 
                  src="https://res.cloudinary.com/fffb5ery/image/upload/v1784291927/Smart_Ticketing_Logo_cw5utb.png" 
                  alt="Smart Ticketing" 
                  className="h-10 w-auto relative z-10 brightness-110 contrast-125"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground font-serif">SmartTicketing</span>
            </Link>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Empowering event organizers with a high-performance, commission-based ticketing platform built for growth.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <motion.a whileHover={{ y: -3 }} href="#" className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/40 transition-all">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/40 transition-all">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/40 transition-all">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </motion.a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground font-serif">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/events" className="text-muted-foreground font-medium hover:text-primary transition-colors">Explore Events</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground font-medium hover:text-primary transition-colors">Pricing Plans</Link></li>
              <li><Link to="/register" className="text-muted-foreground font-medium hover:text-primary transition-colors">Host an Event</Link></li>
              <li><Link to="/login" className="text-muted-foreground font-medium hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground font-serif">Support</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/" className="text-muted-foreground font-medium hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-muted-foreground font-medium hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-muted-foreground font-medium hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-muted-foreground font-medium hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter/Contact */}
          <div className="flex flex-col gap-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground font-serif">Connect</h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 text-muted-foreground group">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">hello@smartticketing.com</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground group">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium truncate">Nairobi, Kenya</span>
              </div>
            </div>
            
            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 mt-4 relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <span className="text-sm font-bold text-foreground">Start growing today</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 relative z-10">Commission-based model for maximum success.</p>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} SmartTicketing Inc. Experience everything.
          </p>
          <div className="flex items-center gap-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-colors">Instagram</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-colors">LinkedIn</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer transition-colors">X</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
