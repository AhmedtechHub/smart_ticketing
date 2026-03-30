import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    Plus, 
    Calendar, 
    MapPin, 
    Search, 
    Ticket, 
    MoreHorizontal,
    Archive,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from "@/api/apiConfig";
import { useToast } from "@/components/ui/use-toast";

const PlannerEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const data = await eventService.getMyEvents();
      setEvents(data.filter(e => e.status !== "ARCHIVED"));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleArchive = async (id: string) => {
    try {
      await eventService.updateMyEventStatus(id, "ARCHIVED");
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: "Event Archived", description: "Successfully moved to tactical archives." });
    } catch (err) {
      toast({ variant: "destructive", title: "Archive Failed" });
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight">Active Events</h1>
          <p className="text-foreground opacity-100 text-sm mt-1">Manage your currently live and pending experiences.</p>
        </div>
        <Button className="rounded-xl gap-2 font-semibold">
          <Plus className="h-4 w-4" /> New Event
        </Button>
      </motion.div>

      <motion.div variants={item} className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100" />
          <Input 
            placeholder="Search active events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-10 rounded-xl glass-effect border-border focus:ring-primary/20" 
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <motion.div key={event.id} layout variants={item}>
                <Card className="rounded-[2rem] border-border bg-card shadow-sm overflow-hidden group hover:border-primary/20 transition-all p-3">
                  <div className="aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-muted relative">
                    {event.image ? (
                      <img src={event.image.startsWith('http') ? event.image : `${API_BASE_URL}${event.image}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center font-medium uppercase tracking-widest text-foreground opacity-100"><Calendar className="h-8 w-8" /></div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={event.status === "APPROVED" ? "default" : "secondary"} className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0">
                        {event.status}
                      </Badge>
                      <span className="text-[10px] text-foreground opacity-100 font-mono">ID: {event.id.slice(-6)}</span>
                    </div>
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-foreground opacity-100 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                      <span className="flex items-center gap-1"><Ticket className="h-3 w-3" /> {event.tickets?.length || 0} Tiers</span>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-border/50">
                      <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 font-semibold text-[10px] uppercase tracking-widest">Analytics</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl glass-effect p-1">
                          <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium text-xs" onClick={() => handleArchive(event.id)}>
                            <Archive className="h-4 w-4" /> Archive Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 border border-dashed rounded-[3rem] text-foreground">Zero active projects detected.</div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PlannerEventsPage;
