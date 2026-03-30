import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "@/api/apiConfig";
import { 
    Plus, 
    Calendar, 
    MapPin, 
    Search, 
    CheckCircle2, 
    Ticket, 
    ExternalLink,
    Star,
    TrendingUp,
    Flame,
    Loader2,
    MoreHorizontal,
    Archive,
    Trash2
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import CreateEventModal from "./Components/CreateEventModal";
import CreateTicketModal from "./Components/CreateTicketModal";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";

const PlannerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchMyEvents = async () => {
    try {
      const data = await eventService.getMyEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleArchive = async (id: string) => {
      try {
          await eventService.updateMyEventStatus(id, "ARCHIVED");
          setEvents(prev => prev.map(e => e.id === id ? { ...e, status: "ARCHIVED" as any } : e));
          toast({ title: "Archived", description: "Event moved to archive." });
      } catch (err) {
          toast({ variant: "destructive", title: "Archive Failed" });
      }
  };

  const handleDelete = async (id: string) => {
      const result = await Swal.fire({
          title: 'Destroy Event?',
          text: "This wipes the event and its history permanently.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Confirm Destruction',
          background: '#0a0a0a',
          color: '#ffffff'
      });

      if (result.isConfirmed) {
          try {
              await eventService.deleteMyEvent(id);
              setEvents(prev => prev.filter(e => e.id !== id));
              toast({ title: "System Cleaned", description: "Event purged from the hive." });
          } catch (err) {
              toast({ variant: "destructive", title: "Purge Failed" });
          }
      }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
      total: events.length,
      approved: events.filter(e => e.status === "APPROVED").length,
      pending: events.filter(e => e.status === "PENDING").length,
      totalTicketsSold: events.reduce((acc, e) => acc + (e._count?.bookings || 0), 0)
  };

  const StatusBadge = ({ status }: { status: string }) => {
      switch (status) {
          case "APPROVED": return <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1 rounded-full font-bold uppercase text-[9px] tracking-widest">Approved</Badge>;
          case "PENDING": return <Badge className="bg-amber-500/10 text-amber-500 border-none px-4 py-1 rounded-full font-bold uppercase text-[9px] tracking-widest">Pending</Badge>;
          case "ARCHIVED": return <Badge className="bg-slate-500/10 text-slate-500 border-none px-4 py-1 rounded-full font-bold uppercase text-[9px] tracking-widest">Archived</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 font-sans"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-4">
        <div>
          <h1 className="text-4xl font-serif font-medium text-foreground tracking-tighter leading-none">
            Planner <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-foreground mt-2 text-base">Orchestrate world-class experiences from your command center.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
              variant="outline"
              onClick={() => setIsTicketModalOpen(true)}
              className="h-12 px-6 rounded-xl border-border bg-card/50 hover:bg-accent font-semibold text-[11px] uppercase tracking-wider transition-all"
          >
            <Ticket className="mr-2 h-4 w-4" /> Add Ticket Tier
          </Button>
          <Button 
              onClick={() => setIsEventModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-[11px] uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Post New Event
          </Button>
        </div>
      </motion.div>

      {/* Insights Bar */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="rounded-[2.5rem] glass-effect border-white/10 overflow-hidden relative group">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <Flame className="w-32 h-32 text-orange-500" />
              </div>
              <CardContent className="p-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground mb-2">Platform Presence</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-5xl font-serif font-bold">{stats.total}</h3>
                    <span className="text-sm font-medium text-foreground">Projects</span>
                </div>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] glass-effect border-white/10 overflow-hidden relative group">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <Star className="w-32 h-32 text-primary" />
              </div>
              <CardContent className="p-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground mb-2">Verification Hub</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-5xl font-serif font-bold text-emerald-500">{stats.approved}</h3>
                    <span className="text-sm font-medium text-foreground">Active</span>
                </div>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] glass-effect border-white/10 overflow-hidden relative group">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-32 h-32 text-amber-500" />
              </div>
              <CardContent className="p-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground mb-2">Audience Reach</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-5xl font-serif font-bold text-primary">{stats.totalTicketsSold}</h3>
                    <span className="text-sm font-medium text-foreground">Sold</span>
                </div>
              </CardContent>
           </Card>
      </motion.div>

      {/* Main Interface */}
      <motion.div variants={item} className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                  <Input
                    placeholder="Filter by title or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 pr-6 rounded-2xl border-white/10 glass-effect bg-white/5 focus-visible:ring-primary/20"
                  />
              </div>
              <div className="text-sm font-medium text-foreground">
                  Sorted by <span className="text-foreground font-bold">Newest First</span>
              </div>
          </div>

          <div className="grid gap-8">
              <AnimatePresence>
                  {loading ? (
                     <div className="text-center py-20 flex flex-col items-center gap-4">
                         <Loader2 className="h-10 w-10 text-primary animate-spin" />
                         <p className="text-foreground font-medium">Syncing with Intelligence Hub...</p>
                     </div>
                  ) : filteredEvents.length > 0 ? (
                      filteredEvents.map((event, i) => (
                          <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="glass-effect group relative overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/10 p-2 pr-10 hover:border-primary/40 transition-all flex flex-col md:flex-row items-center gap-10"
                          >
                              <div className="h-48 w-full md:w-64 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl relative">
                                  {event.image ? (
                                      <img src={event.image.startsWith('http') ? event.image : `${API_BASE_URL}${event.image}`} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                  ) : (
                                      <div className="h-full w-full bg-primary/5 flex items-center justify-center">
                                          <Calendar className="h-12 w-12 text-primary text-foreground" />
                                      </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              </div>

                              <div className="flex-1 py-4 w-full">
                                  <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                          <StatusBadge status={event.status} />
                                          <div className="h-1 w-1 rounded-full bg-border" />
                                          <span className="text-[10px] font-medium text-foreground tracking-widest">ID: {event.id.slice(-6)}</span>
                                      </div>
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl glass-effect border-white/10">
                                                  <MoreHorizontal className="h-5 w-5" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="rounded-2xl glass-effect p-2">
                                              <DropdownMenuItem className="gap-2 rounded-xl py-2.5" onClick={() => handleArchive(event.id)}>
                                                  <Archive className="w-4 h-4" /> Archive Project
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="gap-2 rounded-xl py-2.5 text-destructive" onClick={() => handleDelete(event.id)}>
                                                  <Trash2 className="w-4 h-4" /> Destroy Forever
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </div>
                                  
                                  <h3 className="text-3xl font-serif font-semibold tracking-tight leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                                  
                                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                                      <div className="space-y-1">
                                          <p className="text-[10px] uppercase font-semibold text-foreground tracking-widest">Date & Time</p>
                                          <p className="font-medium flex items-center gap-2 text-sm"><Calendar className="h-3 w-3 text-primary"/> {new Date(event.date).toLocaleDateString()}</p>
                                      </div>
                                      <div className="space-y-1">
                                          <p className="text-[10px] uppercase font-semibold text-foreground tracking-widest">Location</p>
                                          <p className="font-medium flex items-center gap-2 text-sm"><MapPin className="h-3 w-3 text-primary"/> {event.location || 'Remote'}</p>
                                      </div>
                                      <div className="space-y-1">
                                          <p className="text-[10px] uppercase font-semibold text-foreground tracking-widest">Inventory</p>
                                          <p className="font-medium flex items-center gap-2 text-sm"><Ticket className="h-3 w-3 text-primary"/> {event.tickets?.length || 0} Categories</p>
                                      </div>
                                      <div className="space-y-1">
                                          <p className="text-[10px] uppercase font-semibold text-foreground tracking-widest">Attendees</p>
                                          <p className="font-medium flex items-center gap-2 text-sm"><CheckCircle2 className="h-3 w-3 text-primary"/> {event._count?.bookings || 0} Confirmed</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="flex flex-row md:flex-col gap-3 ml-auto">
                                  <Button variant="ghost" className="h-14 w-14 rounded-2xl border-white/10 glass-effect hover:bg-primary hover:text-white transition-all">
                                      <ExternalLink className="h-6 w-6" />
                                  </Button>
                                  <Button variant="ghost" className="h-14 w-14 rounded-2xl border-white/10 glass-effect hover:bg-primary hover:text-white transition-all" onClick={() => setIsTicketModalOpen(true)}>
                                     <Plus className="h-6 w-6" />
                                  </Button>
                              </div>
                          </motion.div>
                      ))
                  ) : (
                      <div className="text-center py-32 glass-effect rounded-[3rem] border border-dashed border-white/10">
                          <Calendar className="h-16 w-16 text-foreground/20 mx-auto mb-6" />
                          <h3 className="text-2xl font-serif font-medium text-foreground">Zero Projects Launched</h3>
                          <p className="text-foreground/60 mt-2 max-w-xs mx-auto text-sm">Use the command bar above to broadcast your first event experience.</p>
                      </div>
                  )}
              </AnimatePresence>
          </div>
      </motion.div>

      {/* Modals */}
      <CreateEventModal 
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onEventCreated={fetchMyEvents}
      />
      <CreateTicketModal 
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onTicketCreated={fetchMyEvents}
      />
    </motion.div>
  );
};

export default PlannerDashboard;
