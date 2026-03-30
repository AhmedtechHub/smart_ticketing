import { useState, useEffect } from "react";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { 
  Ticket, 
  Search, 
  Plus, 
  MoreHorizontal, 
  QrCode, 
  ExternalLink, 
  TrendingUp,
  AlertTriangle,
  Flame,
  Star
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
import CreateTicketModal from "../Components/CreateTicketModal";
import { useToast } from "@/components/ui/use-toast";

const TicketsPage = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const data = await adminApi.getAllTickets();
            setTickets(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(t => 
        t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalStock: tickets.reduce((acc, t) => acc + (t.quantity - t.sold), 0),
        premiumSold: tickets.filter(t => t.type.toUpperCase().includes('VIP')).reduce((acc, t) => acc + t.sold, 0),
        soldCount: tickets.reduce((acc, t) => acc + t.sold, 0),
        totalQty: tickets.reduce((acc, t) => acc + t.quantity, 0),
    };

    const conversionRate = stats.totalQty > 0 ? Math.round((stats.soldCount / stats.totalQty) * 100) : 0;

    return (
        <PageShell
            title="Ticket Inventory"
            description="Manage global ticket types, stock levels, and distribution."
            icon={Ticket}
            action={{ label: "Add Global Ticket Type", onClick: () => setIsModalOpen(true) }}
        >
            <div className="space-y-6">
                {/* Insights Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between overflow-hidden relative group">
                        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <Flame className="w-24 h-24 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Availability</p>
                            <h4 className="text-2xl font-black">
                                {stats.totalStock >= 1000 ? `${(stats.totalStock / 1000).toFixed(1)}k` : stats.totalStock}
                                <span className="text-xs font-medium text-muted-foreground ml-1">Unsold</span>
                            </h4>
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-600 border-none font-bold">Live Inventory</Badge>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between overflow-hidden relative group">
                        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <Star className="w-24 h-24 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Premium Admissions</p>
                            <h4 className="text-2xl font-black">
                                {stats.premiumSold >= 1000 ? `${(stats.premiumSold / 1000).toFixed(1)}k` : stats.premiumSold}
                                <span className="text-xs font-medium text-muted-foreground ml-1">VIP</span>
                            </h4>
                        </div>
                        <Badge className="bg-purple-500/10 text-purple-600 border-none font-bold">High Tier</Badge>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between overflow-hidden relative group">
                        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp className="h-24 w-24 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Fill Rate</p>
                            <h4 className="text-2xl font-black">{conversionRate}%</h4>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">Capacity</Badge>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Filter by type or event title..." 
                            className="pl-10 h-11 rounded-xl bg-muted/20 border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Ticket List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredTickets.map((ticket, i) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="p-5 border-b border-border border-dashed relative">
                                    <div className="flex items-center justify-between mb-2">
                                         <Badge className={`uppercase text-[10px] font-black border-none px-2 ${ticket.type === 'VIP' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                                            {ticket.type}
                                         </Badge>
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg -mr-2">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2"><QrCode className="w-4 h-4" /> Download QR (PNG)</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2"><Plus className="w-4 h-4" /> Restock Amount</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 text-destructive"><XSquare className="w-4 h-4" /> Disable Tier</DropdownMenuItem>
                                            </DropdownMenuContent>
                                         </DropdownMenu>
                                    </div>
                                    <h4 className="text-xl font-bold text-foreground">KES {parseFloat(ticket.price).toLocaleString()}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{ticket.event?.title}</p>
                                </div>
                                <div className="p-5 space-y-4">
                                     <div className="space-y-1.5">
                                         <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                             <span>Inventory Status</span>
                                             <span>{ticket.sold} / {ticket.quantity} SOLD</span>
                                         </div>
                                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                             <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }} 
                                                className={`h-full ${ticket.sold / ticket.quantity > 0.8 ? 'bg-orange-500' : 'bg-primary'}`} 
                                             />
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-2 gap-3">
                                         <div className="p-2 rounded-xl bg-muted/20 border border-border/50 text-center">
                                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Revenue</p>
                                              <p className="text-sm font-black mt-0.5">{(ticket.sold * parseFloat(ticket.price)).toLocaleString()}</p>
                                         </div>
                                         <div className="p-2 rounded-xl bg-muted/20 border border-border/50 text-center">
                                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Stock</p>
                                              <p className="text-sm font-black mt-0.5">{ticket.quantity - ticket.sold}</p>
                                         </div>
                                     </div>
                                     <Button variant="ghost" className="w-full h-10 rounded-xl text-xs font-bold uppercase tracking-wider gap-2">
                                         Manage Event <ExternalLink className="w-3 h-3" />
                                     </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!loading && filteredTickets.length === 0 && (
                    <div className="py-20 text-center">
                        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                        <h3 className="text-lg font-semibold text-muted-foreground">No inventory records available</h3>
                    </div>
                )}
            </div>

            <CreateTicketModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTicketCreated={() => {
                    fetchTickets();
                    toast({
                        title: "Tier Online",
                        description: "Global ticket category perfectly bound and pushed.",
                    });
                }}
            />
        </PageShell>
    );
};

// Simple helper icon
const XSquare = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

export default TicketsPage;
