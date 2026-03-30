import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    Ticket, 
    Plus, 
    Calendar,
    Search,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import CreateTicketModal from "../Components/CreateTicketModal";

const TicketTiersPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    const fetchTiers = async () => {
        try {
            const data = await eventService.getMyEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch tier data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, []);

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            className="space-y-8 pb-10"
        >
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-medium tracking-tight leading-none">Ticket Management</h1>
                    <p className="text-foreground opacity-100 text-sm mt-1">Configure pricing tiers and monitor inventory distribution.</p>
                </div>
                <Button className="rounded-xl gap-2 font-semibold" onClick={() => setIsTicketModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Create Tier
                </Button>
            </motion.div>

            <motion.div variants={item} className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100" />
                    <Input 
                        placeholder="Search event containers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 pl-10 rounded-xl glass-effect border-border focus:ring-primary/20" 
                    />
                </div>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 gap-10">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <Card key={event.id} className="rounded-[3rem] border-border bg-card shadow-sm p-10 flex flex-col lg:flex-row gap-12 group transition-all hover:border-primary/20">
                            <div className="lg:w-1/3">
                                <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-[0.2em] mb-3 px-3 py-0.5 rounded-full border-primary/20 bg-primary/5 text-primary">Internal Project</Badge>
                                <h3 className="text-2xl font-serif font-semibold truncate leading-tight mb-2">{event.title}</h3>
                                <div className="text-xs text-foreground opacity-100 flex items-center gap-3 font-medium">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString()}</span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span className="flex items-center gap-1"><Ticket className="h-3 w-3" /> {event.tickets?.length || 0} Categories</span>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {event.tickets && event.tickets.length > 0 ? (
                                    event.tickets.map((t: any) => {
                                        const progress = (t.sold || 0) / t.quantity * 100;
                                        return (
                                            <div key={t.id} className="relative p-6 rounded-[2rem] bg-muted/20 border border-border/50 group/item hover:bg-muted/30 transition-all">
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-item-hover:opacity-100 transition-opacity rounded-[2rem]" />
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-foreground opacity-100">{t.type}</span>
                                                    <span className="text-lg font-serif font-bold text-primary">KES {(Number(t.price)).toLocaleString()}</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                                        <span className="text-foreground opacity-100">Inventory</span>
                                                        <span>{t.sold || 0} / {t.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-foreground opacity-100 font-bold">{Math.round(progress)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full py-6 text-center border border-dashed rounded-[2rem] text-foreground opacity-100 text-xs font-medium">
                                        Zero segments initialized. Click "Create Tier" to deploy.
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed rounded-[3rem] text-foreground">
                        No active project containers found.
                    </div>
                )}
            </motion.div>

            <CreateTicketModal 
                isOpen={isTicketModalOpen} 
                onClose={() => setIsTicketModalOpen(false)} 
                onTicketCreated={fetchTiers} 
            />
        </motion.div>
    );
};

export default TicketTiersPage;
