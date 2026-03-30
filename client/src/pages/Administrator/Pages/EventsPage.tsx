import { useState, useEffect } from "react";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { API_BASE_URL } from "@/api/apiConfig";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";
import { 
  CalendarCheck, 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Ticket, 
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import CreateEventModal from "../Components/CreateEventModal";

const EventsPage = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await adminApi.getEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: any) => {
        try {
            await adminApi.updateEventStatus(id, status);
            setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
            toast({
                title: "Status Updated",
                description: `Event status changed to ${status}`,
            });
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: err.response?.data?.error || err.message || "Failed to update event status",
            });
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this event forever? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            await adminApi.deleteEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
            toast({
                title: "Event Deleted",
                description: "The event has been permanently removed.",
            });
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: err.response?.data?.error || err.message || "Failed to delete event",
            });
            console.error(err);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case "APPROVED": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Approved</Badge>;
            case "PENDING": return <Badge className="bg-amber-500/10 text-amber-600 border-none">Pending</Badge>;
            case "ARCHIVED": return <Badge className="bg-slate-500/10 text-slate-600 border-none">Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageShell
            title="Event Management"
            description="Monitor, approve, and manage all events within the platform."
            icon={CalendarCheck}
            action={{ label: "Post New Event", onClick: () => setIsModalOpen(true) }}
        >
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search events by title or location..." 
                            className="pl-10 h-11 bg-muted/20 border-border rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredEvents.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-card rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="aspect-video relative overflow-hidden bg-muted">
                                    {event.image ? (
                                        <img 
                                            src={event.image.startsWith('http') ? event.image : `${API_BASE_URL}${event.image}`} 
                                            alt={event.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <CalendarCheck className="w-8 h-8 text-muted-foreground opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <StatusBadge status={event.status} />
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-foreground leading-tight">{event.title}</h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg -mr-2">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(event.id, 'APPROVED')}><CheckCircle2 className="w-4 h-4" /> Approve Event</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(event.id, 'ARCHIVED')}><Archive className="w-4 h-4" /> Archive Event</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /> Delete Forever</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <User className="w-4 h-4" />
                                            By {event.creator?.name || 'Unknown'}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-primary font-bold">
                                            <Ticket className="w-4 h-4" />
                                            {event._count?.bookings || 0} Tickets
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold uppercase tracking-wider gap-2">
                                            Details <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!loading && filteredEvents.length === 0 && (
                    <div className="py-20 text-center">
                        <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-muted-foreground">No events found</h3>
                        <p className="text-sm text-muted-foreground/60">Try adjusting your filters or post a new event.</p>
                    </div>
                )}
            </div>

            <CreateEventModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEventCreated={() => {
                    fetchEvents();
                    toast({
                        title: "Event Created",
                        description: "New event posted successfully.",
                    });
                }}
            />
        </PageShell>
    );
};

export default EventsPage;
