import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { eventService } from "@/api/events";
import { API_BASE_URL } from "@/api/apiConfig";

interface PastEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  attendees: number;
  image: string;
  category: string;
}


export default function PastEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const all = await eventService.getPublicEvents();
        const now = new Date();

        const past = all
          .filter((e) => new Date(e.date) < now)
          .slice(0, 9) // cap at 9 for the grid
          .map((e) => {
            const minPrice =
              e.tickets && e.tickets.length > 0
                ? Math.min(
                    ...e.tickets.map((t) => {
                      const v =
                        typeof t.price === "string" ? parseFloat(t.price) : t.price;
                      return isNaN(v) ? 0 : v;
                    })
                  )
                : 0;

            let image = e.image;
            if (image && image.startsWith("/uploads")) {
              image = `${API_BASE_URL}${image}`;
            }

            return {
              id: e.id,
              title: e.title,
              date: new Date(e.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              location: e.location,
              price: minPrice > 0 ? `KES ${minPrice.toLocaleString()}` : "Free",
              attendees: e._count?.bookings || 0,
              image:
                image ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              category: "Past Event",
            };
          });

        setEvents(past);
      } catch (err) {
        console.error("Failed to fetch past events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  // Nothing to show — don't render the section at all
  if (!loading && events.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32 font-sans">
      {/* dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            In The Archives
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl lg:text-7xl"
          >
            Events that{" "}
            <span className="text-primary">made history</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl font-sans font-medium text-foreground/60"
          >
            Relive unforgettable moments. From sold-out concerts to cultural
            milestones — these are the events our community loved most.
          </motion.p>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          /* skeleton shimmer */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-[2rem] border border-border bg-muted"
              >
                <div className="h-52 bg-muted-foreground/10" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-1/3 rounded bg-muted-foreground/20" />
                  <div className="h-5 w-3/4 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-1/2 rounded bg-muted-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/10 glass-effect shadow-lg hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {/* image */}
                <div className="relative h-52 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6 }}
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover brightness-90 grayscale-[20%]"
                  />
                  {/* dark overlay for "past" feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <Badge className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest">
                    Past
                  </Badge>

                  {/* attendee count badge */}
                  {event.attendees > 0 && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5">
                      <Users size={12} className="text-primary" />
                      <span className="text-[11px] font-bold text-white">
                        {event.attendees.toLocaleString()} attended
                      </span>
                    </div>
                  )}
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
                    <Calendar size={12} />
                    {event.date}
                  </div>

                  <h3 className="font-serif text-lg font-normal leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={13} />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-border mt-5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Ticket price was
                    </span>
                    <span className="font-black text-foreground">{event.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Footer CTA ── */}
        {!loading && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 flex justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/events")}
              className="h-14 rounded-2xl border-primary/40 px-10 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Browse upcoming events →
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
