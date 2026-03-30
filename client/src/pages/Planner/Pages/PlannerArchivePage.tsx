import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    Archive,
    History,
    Search,
    Loader2,
    Calendar,
    RefreshCw,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/api/apiConfig";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";

const PlannerArchivePage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchArchived = async () => {
        try {
            const data = await eventService.getMyEvents();
            setEvents(data.filter(e => e.status === "ARCHIVED"));
        } catch (error) {
            console.error("Failed to fetch archive:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchived();
    }, []);

    const handleRestore = async (id: string) => {
        try {
            await eventService.updateMyEventStatus(id, "PENDING");
            setEvents(prev => prev.filter(e => e.id !== id));
            toast({ title: "Restored", description: "Event moved back to operations." });
        } catch (err) {
            toast({ variant: "destructive", title: "Restore Failed" });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Purge Permanently?',
            text: "This cannot be undone. All data will be wiped.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Purge',
            background: '#0a0a0a',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                await eventService.deleteMyEvent(id);
                setEvents(prev => prev.filter(e => e.id !== id));
                toast({ title: "Purged", description: "Event removed from existence." });
            } catch (err) {
                toast({ variant: "destructive", title: "Purge Failed" });
            }
        }
    };

    const filtered = events.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
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
                    <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">Archive Box</h1>
                    <p className="text-foreground opacity-100 text-sm mt-1">Historical records of your past event experiences.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                    <History className="h-6 w-6 opacity-40 text-foreground" />
                </div>
            </motion.div>

            <motion.div variants={item} className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100" />
                <Input 
                    placeholder="Search archive..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 rounded-xl glass-effect border-border focus:ring-primary/20" 
                />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full py-20 flex justify-center text-foreground"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                    ) : filtered.map(event => (
                        <motion.div key={event.id} variants={item} layout>
                            <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden group hover:border-primary/20 transition-all border">
                              <div className="aspect-video relative overflow-hidden bg-muted">
                                {event.image ? (
                                    <img src={event.image.startsWith('http') ? event.image : `${API_BASE_URL}${event.image}`} className="h-full w-full object-cover filter grayscale opacity-60" />
                                ) : (
                                    <div className="h-full w-full bg-muted flex items-center justify-center text-foreground opacity-100"><Calendar className="h-10 w-10" /></div>
                                )}
                              </div>
                              <div className="p-6">
                                <h3 className="text-lg font-serif font-semibold truncate group-hover:text-primary transition-colors text-foreground">{event.title}</h3>
                                <div className="mt-4 flex items-center justify-between">
                                    <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest gap-2 text-foreground" onClick={() => handleRestore(event.id)}>
                                        <RefreshCw className="h-3 w-3" /> Restore
                                    </Button>
                                    <Button variant="ghost" className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete(event.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                              </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {!loading && filtered.length === 0 && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed rounded-[3rem] border-border text-foreground">
                        <Archive className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="opacity-100 font-medium">Archive box is currently empty.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PlannerArchivePage;
