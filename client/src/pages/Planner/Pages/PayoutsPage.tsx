import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    TrendingUp, 
    ArrowUpRight, 
    History, 
    Filter, 
    ExternalLink,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PayoutsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRevenueData = async () => {
        try {
            const data = await eventService.getMyEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch revenue data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const totalRevenue = events.reduce((acc, e) => acc + ( (e._count?.bookings || 0) * 1500 ), 0); // Mock pricing logic
    const platformFee = totalRevenue * 0.10;
    const netPayout = totalRevenue - platformFee;

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
                    <h1 className="text-3xl font-serif font-medium tracking-tight">Revenue Stream</h1>
                    <p className="text-foreground opacity-100 text-sm mt-1">Manage institutional payouts and financial clearance.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 font-semibold">
                        <History className="h-4 w-4" /> Reports
                    </Button>
                    <Button className="rounded-xl h-12 px-8 font-semibold">Initiate Payout</Button>
                </div>
            </motion.div>

            {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : (
                <>
                    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="rounded-[2.5rem] border-border bg-card shadow-sm p-8 relative overflow-hidden">
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 mb-1 opacity-50">Total Gross Revenue</p>
                           <h3 className="text-3xl font-serif font-bold text-foreground">KES {totalRevenue.toLocaleString()}</h3>
                           <div className="mt-4 flex items-center gap-2 text-emerald-500 font-semibold text-xs uppercase tracking-tighter">
                               <ArrowUpRight className="h-4 w-4" /> 100% Tactical Yield
                           </div>
                        </Card>

                        <Card className="rounded-[2.5rem] border-border bg-card shadow-sm p-8 relative overflow-hidden">
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground opacity-100 mb-1 opacity-50">Platform Processing Fee (10%)</p>
                           <h3 className="text-3xl font-serif font-bold text-rose-500">KES {platformFee.toLocaleString()}</h3>
                           <div className="mt-4 flex items-center gap-2 text-foreground opacity-100 font-medium text-xs uppercase tracking-tighter opacity-40">
                               <TrendingUp className="h-4 w-4" /> Fixed Ecosystem Cost
                           </div>
                        </Card>

                        <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-sm p-8 relative overflow-hidden border">
                           <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1 opacity-70">Net Available for Payout</p>
                           <h3 className="text-4xl font-serif font-bold text-primary">KES {netPayout.toLocaleString()}</h3>
                           <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-tighter pulse-slow">
                               <CheckCircle2 className="h-4 w-4" /> Ready for Withdrawal
                           </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={item} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-serif font-medium">Recent Settlements</h3>
                            <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-xs font-semibold uppercase tracking-widest">
                                <Filter className="h-3.5 w-3.5 mr-2" /> Filter Stream
                            </Button>
                        </div>
                        <div className="glass-effect rounded-[2rem] border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/30">
                                        <tr className="text-[10px] uppercase font-semibold tracking-widest text-foreground opacity-100">
                                            <th className="px-8 py-4">Event Ref</th>
                                            <th className="px-8 py-4">Date</th>
                                            <th className="px-8 py-4">Amount</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {events.map((e, idx) => (
                                            <tr key={idx} className="hover:bg-muted/10 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <p className="font-semibold text-foreground">{e.title}</p>
                                                    <p className="text-[10px] text-foreground opacity-100 font-mono mt-0.5 opacity-40">TRX-{e.id.slice(-8).toUpperCase()}</p>
                                                </td>
                                                <td className="px-8 py-6 text-foreground font-medium opacity-100 opacity-60">
                                                    {new Date(e.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6 font-semibold text-foreground">
                                                    KES {((e._count?.bookings || 0) * 1500).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                     <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-500 uppercase tracking-widest">Clear</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-border/50">
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
                </>
            )}
        </motion.div>
    );
};

export default PayoutsPage;
