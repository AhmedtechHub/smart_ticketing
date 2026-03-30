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

  // Framer Motion scroll animations for the whole container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Entrance Variants
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
        // Fetch up to 9 for the hero carousel
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

    const debounceTimer = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Auto-advance carousel — slides one card at a time
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
  // translateX: moving by 1 card = shifting by 1/VISIBLE width
  const stripOffset = -(currentIndex * (100 / VISIBLE));

  return (
    <section
      ref={containerRef}
      className="relative  overflow-hidden bg-background font-sans"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Simple Background Overlays */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* Main Content Wrapper */}
      <motion.div
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pt-16 lg:px-8"
      >
        <div className="flex flex-col items-center text-center">
          {/* Branded Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <Badge variant="outline" className="glass-effect border-primary/20 px-4 py-1.5 text-sm font-medium text-primary tracking-wide transition-colors">
              <Sparkles className="mr-2 h-4 w-4" />
              Streamlining the Future of Events
            </Badge>
          </motion.div>

          {/* Epic Header */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-5xl font-serif font-medium tracking-tight sm:text-7xl lg:text-8xl text-foreground"
          >
            Extraordinary <br className="hidden sm:block" />
            <span className="text-primary">Events & Experiences</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-2xl text-lg leading-8 text-foreground sm:text-xl"
          >
            Your VIP pass to the world's most exclusive gatherings. Secure tickets, 
            discover local happenings, and manage your bookings on the premier ticketing hub.
          </motion.p>

          {/* Dynamic Search Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-12 w-full max-w-2xl px-2"
          >
            <div className="glass-effect group relative flex items-center rounded-3xl border border-primary/40 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 focus-within:ring-2 focus-within:ring-primary/50">
              <Search className="ml-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Search events, cities, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent py-7 pl-3 pr-24 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-foreground/50"
              />
              <Button
                size="lg"
                onClick={() => navigate(`/events${searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : ''}`)}
                className="absolute right-2 h-[52px] rounded-2xl px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
              >
                Explore
              </Button>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Event Cards Carousel — 3 visible at a time, strips right-to-left */}
      {featuredEvents.length > 0 && (
        <div className="relative z-20 mt-12 w-full">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            {/* Section Header */}
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
              >
                What's On
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl lg:text-7xl"
              >
                Upcoming{" "}
                <span className="text-primary">Events</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mx-auto mt-5 max-w-xl font-sans font-medium text-foreground/60"
              >
                Handpicked experiences happening near you. Grab your tickets before they're gone.
              </motion.p>
            </div>

            {/* Sliding strip viewport */}
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `${stripOffset}%` }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              >
                {featuredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex-shrink-0 px-3 transition-all duration-300"
                    style={{ minWidth: `${100 / VISIBLE}%` }}
                  >
                    <div className="glass-effect group flex flex-col overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/10 shadow-2xl hover:border-primary/40 transition-all duration-300 h-full">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <Badge className="absolute top-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                          {event.category}
                        </Badge>
                      </div>

                      {/* Body */}
                      <div className="p-7">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                          <Calendar size={13} />
                          {event.date}
                        </div>
                        <h3 className="text-xl font-serif font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={15} />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                          </div>
                          <div className="text-xl font-black text-foreground">
                            {event.price}
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="mt-6 w-full py-5 rounded-2xl transition-transform hover:scale-[1.02]"
                        >
                          View Event
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dot Indicators — only when there are more than 3 events */}
            {maxIndex > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-6 h-2 bg-primary'
                        : 'w-2 h-2 bg-muted-foreground/30 hover:bg-primary/50'
                    }`}
                    aria-label={`Go to position ${i + 1}`}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modern Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;