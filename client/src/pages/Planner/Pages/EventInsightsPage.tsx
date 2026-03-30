import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    TrendingUp, 
    Flame, 
    CreditCard, 
    Users, 
    Star, 
    ArrowUpRight, 
    ArrowDownRight,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EventInsightsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await eventService.getMyEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch insight data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = {
        totalRevenue: events.reduce((acc, e) => acc + (e._count?.bookings || 0) * 1000, 0), // Placeholder logic
        totalTicketsSold: events.reduce((acc, e) => acc + (e._count?.bookings || 0), 0),
        activeEvents: events.filter(e => e.status === "APPROVED").length,
        avgConversion: events.length > 0 ? Math.round((events.filter(e => e.status === "APPROVED").length / events.length) * 100) : 0
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
            className="space-y-8 pb-10"
        >
            <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                <div>
                    <h1 className="text-4xl font-serif font-medium tracking-tight leading-none">Event <span className="text-primary italic">Analytics</span></h1>
                    <p className="text-foreground opacity-100 mt-2 text-base">Harness the power of data to architect better experiences.</p>
                </div>
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" /> Real-time Intel Hub
                </Badge>
            </motion.div>

            {loading ? (
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="rounded-[2.5rem] border-border bg-card shadow-sm p-6 relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-4">
                              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><CreditCard className="h-5 w-5" /></div>
                              <span className="text-[10px] items-center flex gap-1 font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full"><ArrowUpRight className="h-3 w-3" /> 12%</span>
                           </div>
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 mb-1 opacity-50">Total Revenue Generated</p>
                           <h3 className="text-3xl font-serif font-bold">KES {stats.totalRevenue.toLocaleString()}</h3>
                        </Card>

                        <Card className="rounded-[2.5rem] border-border bg-card shadow-sm p-6 relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-4">
                              <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Users className="h-5 w-5" /></div>
                              <span className="text-[10px] items-center flex gap-1 font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full"><ArrowUpRight className="h-3 w-3" /> 8%</span>
                           </div>
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 mb-1 opacity-50">Combined Audience List</p>
                           <h3 className="text-3xl font-serif font-bold text-orange-500">{stats.totalTicketsSold} <span className="text-lg text-foreground opacity-100">Sold</span></h3>
                        </Card>

                        <Card className="rounded-[2.5rem] border-border bg-card shadow-sm p-6 relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-4">
                              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Star className="h-5 w-5" /></div>
                              <span className="text-[10px] items-center flex gap-1 font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full"><ArrowDownRight className="h-3 w-3" /> 2%</span>
                           </div>
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 mb-1 opacity-50">Active Operational Hubs</p>
                           <h3 className="text-3xl font-serif font-bold text-emerald-500">{stats.activeEvents} <span className="text-lg text-foreground opacity-100">Live</span></h3>
                        </Card>

                        <Card className="rounded-[2.5rem] border-border bg-card shadow-sm p-6 relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-4">
                              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><TrendingUp className="h-5 w-5" /></div>
                           </div>
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 mb-1 opacity-50">Tactical Efficiency</p>
                           <h3 className="text-3xl font-serif font-bold text-amber-500">{stats.avgConversion}% <span className="text-lg text-foreground opacity-100">Yield</span></h3>
                        </Card>
                    </motion.div>

                    <Card className="rounded-[3rem] border-border bg-card shadow-sm p-10 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8">
                           <div>
                              <h3 className="text-xl font-serif font-semibold tracking-tight">Real-time Traffic Visualization</h3>
                              <p className="text-sm text-foreground opacity-100">Market activity across all project sectors.</p>
                           </div>
                           <Badge className="bg-primary/10 text-primary border-none font-bold text-[9px] px-3 py-1">Last 24 Hours</Badge>
                        </div>
                        <div className="h-[300px] w-full rounded-[2rem] bg-muted/20 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                            <div className="text-center space-y-4">
                                <div className="h-16 w-16 mx-auto rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
                                    <TrendingUp className="h-8 w-8 opacity-100 text-foreground text-primary font-bold" />
                                </div>
                                <p className="text-sm font-medium text-foreground text-foreground font-serif font-bold">Awaiting further tactical data for visualization...</p>
                            </div>
                        </div>
                    </Card>
                </>
            )}
        </motion.div>
    );
};

export default EventInsightsPage;
