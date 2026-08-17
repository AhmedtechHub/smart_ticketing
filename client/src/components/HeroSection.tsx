import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search, Sparkles } from "lucide-react";
import { eventService } from "@/api/events";
import { API_BASE_URL } from "@/api/apiConfig";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const VISIBLE = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = searchQuery ? { search: searchQuery } : {};
        const events = await eventService.getPublicEvents(params);

        const formattedEvents = events.slice(0, 9).map(event => {
          const minPrice = event.tickets && event.tickets.length > 0
            ? Math.min(...event.tickets.map(t => {
                const priceValue = typeof t.price === 'string' ? parseFloat(t.price) : t.price;
                return isNaN(priceValue) ? 0 : priceValue;
              }))
            : 0;

          let eventImage = event.image;
          if (eventImage && eventImage.startsWith('/uploads')) {
            eventImage = `${API_BASE_URL}${eventImage}`;
          }

          return {
            id: event.id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            location: event.location,
            price: minPrice > 0 ? `KES ${minPrice}` : "Free",
            attendees: event._count?.bookings || 0,
            image: eventImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Event",
          };
        });

        setFeaturedEvents(formattedEvents);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Failed to fetch featured events:", error);
      }
    };

    const debounceTimer = setTimeout(fetchEvents, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    if (featuredEvents.length <= VISIBLE) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const max = featuredEvents.length - VISIBLE;
        return prev >= max ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [featuredEvents.length]);

  const maxIndex = Math.max(0, featuredEvents.length - VISIBLE);
  const stripOffset = -(currentIndex * (100 / VISIBLE));

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-background font-sans"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pt-16 lg:px-8"
      >
        <div className="flex flex-col items-center text-center">

          <motion.div variants={itemVariants} className="mb-8">
            <Badge className="glass-effect border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Streamlining the Future of Events
            </Badge>
          </motion.div>

          {/* ✅ UPDATED HEADER */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-5xl font-serif font-medium tracking-tight sm:text-7xl lg:text-8xl text-foreground"
          >
            Extraordinary <br className="hidden sm:block" />
            <span className="text-blue-600">Events & Experiences</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-2xl text-lg leading-8 text-foreground sm:text-xl"
          >
            Your VIP pass to the world's most exclusive gatherings. Secure tickets, 
            discover local happenings, and manage your bookings on the premier ticketing hub.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-12 w-full max-w-2xl px-2">
            <div className="glass-effect group relative flex items-center rounded-3xl border border-primary/40 p-1.5">
              <Search className="ml-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events, cities, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent py-7 pl-3 pr-24 text-lg"
              />
              <Button
                size="lg"
                onClick={() => navigate(`/events`)}
                className="absolute right-2 h-[52px] rounded-2xl px-8"
              >
                Explore
              </Button>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;