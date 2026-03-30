import { useState, useEffect } from "react";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { API_BASE_URL } from "@/api/apiConfig";
import { 
  Sparkles, 
  CheckCircle, 
  XSquare, 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const ApprovalsPage = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const fetchPendingEvents = async () => {
        try {
            const data = await adminApi.getEvents();
            // Filter only pending
            setEvents(data.filter((e: any) => e.status === 'PENDING'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'ARCHIVED') => {
        try {
            await adminApi.updateEventStatus(id, status);
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <PageShell
            title="Approvals Center"
            description="Manage platform quality by reviewing and approving new event submissions."
            icon={Sparkles}
        >
            <div className="space-y-6">
                {/* Notice Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Content Moderation</h3>
                            <p className="text-sm text-muted-foreground font-medium">Review events for compliance with platform guidelines before they go live.</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-2xl font-black text-primary">{events.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Review</span>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-card rounded-2xl border border-border p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Event Thumbnail */}
                                <div className="h-24 w-40 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                    {event.image ? (
                                        <img 
                                            src={event.image.startsWith('http') ? event.image : `${API_BASE_URL}${event.image}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            alt={event.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-30">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Event Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                         <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold text-[10px] px-2 uppercase tracking-tight">Need Approval</Badge>
                                         <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted {new Date(event.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-lg font-black text-foreground truncate">{event.title}</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {event.creator?.name || 'Unknown Organizer'}</span>
                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {event.location}</span>
                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Button 
                                        onClick={() => handleAction(event.id, 'APPROVED')}
                                        className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-2 text-white shadow-lg shadow-emerald-600/20"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleAction(event.id, 'ARCHIVED')}
                                        className="flex-1 md:flex-none h-11 px-6 rounded-xl border-border hover:bg-destructive/5 font-bold gap-2 text-destructive"
                                    >
                                        <XSquare className="w-4 h-4" /> Reject
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl">
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!loading && events.length === 0 && (
                    <div className="py-24 text-center">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                             <AlertCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                             <h3 className="text-xl font-bold text-muted-foreground">Inbox Zero!</h3>
                             <p className="text-sm text-muted-foreground mt-2 font-medium">Everything has been reviewed. You're all caught up!</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </PageShell>
    );
};

export default ApprovalsPage;
