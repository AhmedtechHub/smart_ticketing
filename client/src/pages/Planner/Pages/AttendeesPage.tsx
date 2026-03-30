import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    Search, 
    Filter, 
    Download, 
    ExternalLink,
    Mail,
    Phone,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AttendeesPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [attLoading, setAttLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        try {
            const data = await eventService.getMyEvents();
            setEvents(data);
            if (data.length > 0 && !selectedEventId) {
                setSelectedEventId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch event data:", error);
        }
    };

    const fetchAttendees = async (id: string) => {
        try {
            setAttLoading(true);
            const data = await eventService.getEventAttendees(id);
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch attendees:", error);
        } finally {
            setAttLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            fetchAttendees(selectedEventId);
        }
    }, [selectedEventId]);

    const filteredBookings = bookings.filter(b => 
        (b.attendee?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.attendee?.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.98 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-10"
        >
            <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-medium tracking-tight">Intelligence List</h1>
                    <p className="text-foreground opacity-100 text-sm mt-1">Real-time oversight of verified audience manifests.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 font-semibold">
                        <Filter className="h-4 w-4" /> Parameters
                    </Button>
                    <Button className="rounded-xl h-12 px-8 gap-2 font-semibold">
                        <Download className="h-4 w-4" /> Export Data
                    </Button>
                </div>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {events.map(e => (
                    <button
                        key={e.id}
                        onClick={() => setSelectedEventId(e.id)}
                        className={`p-4 rounded-[2rem] border transition-all flex items-center gap-4 text-left ${
                            selectedEventId === e.id 
                            ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                            : 'bg-card border-border hover:border-primary/40'
                        }`}
                    >
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedEventId === e.id ? 'bg-primary-foreground/20 text-primary-foreground font-semibold' : 'bg-primary/10 text-primary font-semibold'}`}>
                            {e.title.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-semibold truncate ${selectedEventId === e.id ? 'text-primary-foreground' : 'text-foreground'}`}>{e.title}</p>
                            <p className={`text-[10px] uppercase font-medium tracking-widest ${selectedEventId === e.id ? 'text-primary-foreground/60' : 'text-foreground opacity-60'}`}>{new Date(e.date).toLocaleDateString()}</p>
                        </div>
                    </button>
                ))}
            </motion.div>

            <motion.div variants={item} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100" />
                      <Input 
                          placeholder="Search verified identifiers..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-12 pl-10 rounded-xl glass-effect border-border" 
                      />
                  </div>
                   <div className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 opacity-60">
                      <span>Verified: {attLoading ? '...' : bookings.length}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-border" />
                      <span>Security Clear: 100%</span>
                  </div>
                </div>

                <div className="glass-effect rounded-[3rem] border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr className="text-[10px] uppercase font-semibold tracking-widest text-foreground opacity-100">
                            <th className="px-8 py-6">Attendee Info</th>
                            <th className="px-8 py-6">Ticket Tier</th>
                            <th className="px-8 py-6">Reference Code</th>
                            <th className="px-8 py-6">Contact Channels</th>
                            <th className="px-8 py-6 text-right">Action Hub</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {attLoading ? (
                            <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></td></tr>
                          ) : filteredBookings.map((booking, idx) => (
                            <tr key={idx} className="hover:bg-muted/10 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-primary/5">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.attendee.name}`} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{booking.attendee.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-foreground text-sm">{booking.attendee.name || 'Anonymous'}</p>
                                    <p className="text-[10px] font-mono text-foreground opacity-100 opacity-40 mt-1">ID: {booking.attendee.id.slice(-8).toUpperCase()}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <Badge variant="outline" className="rounded-lg capitalize bg-emerald-500/5 text-emerald-500 border-emerald-500/20 font-semibold text-[10px] tracking-widest px-3 py-1">
                                    {booking.ticket.type}
                                </Badge>
                                <p className="text-[10px] text-foreground opacity-100 mt-2 font-mono flex items-center gap-1 opacity-40"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> POS: {booking.quantity}x UNITS</p>
                              </td>
                              <td className="px-8 py-6">
                                <span className="font-mono text-xs text-foreground opacity-100 font-semibold bg-muted px-2 py-1 rounded-md opacity-60 overflow-hidden">{booking.reference || booking.id.slice(0, 12).toUpperCase()}</span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground opacity-100 hover:bg-primary hover:text-white transition-all"><Mail className="h-3.5 w-3.5" /></button>
                                  <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground opacity-100 hover:bg-primary hover:text-white transition-all"><Phone className="h-3.5 w-3.5" /></button>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all border border-border/50">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AttendeesPage;
