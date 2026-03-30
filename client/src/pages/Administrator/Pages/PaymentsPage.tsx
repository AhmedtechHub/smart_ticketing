import { useState, useEffect } from "react";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { 
  CreditCard, 
  Search, 
  Download, 
  Filter, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Hash,
  User,
  Calendar,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await adminApi.getPayments();
            setPayments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case "SUCCESSFUL": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-medium px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Success</Badge>;
            case "PENDING": return <Badge className="bg-amber-500/10 text-amber-600 border-none font-medium px-2 py-0.5"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case "FAILED": return <Badge className="bg-destructive/10 text-destructive border-none font-medium px-2 py-0.5"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredPayments = payments.filter(p => 
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.attendee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = payments.reduce((acc, p) => p.status === 'SUCCESSFUL' ? acc + parseFloat(p.amount) : acc, 0);

    return (
        <PageShell
            title="Finance & Payments"
            description="Complete overview of all transactions, payouts, and revenue streams."
            icon={CreditCard}
        >
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <TrendingUp className="h-5 w-5 text-primary" />
                             </div>
                             <span className="text-xs font-bold text-emerald-500">+18% Real-time</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">KES {totalRevenue.toLocaleString()}</h3>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">Platform Revenue</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                                <Wallet className="h-5 w-5 text-orange-600" />
                             </div>
                             <span className="text-xs font-bold text-muted-foreground">32 Pending Payouts</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">KES 840,000</h3>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">Amount Owed to Planners</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                                <Hash className="h-5 w-5 text-purple-600" />
                             </div>
                             <span className="text-xs font-bold text-muted-foreground">Across all Gateways</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">{payments.length}</h3>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">Total Transactions</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by reference, user or event..." 
                            className="pl-10 h-11 rounded-xl bg-muted/20 border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" className="h-11 rounded-xl border-border gap-2"><Filter className="w-4 h-4" /> Filter</Button>
                         <Button variant="outline" className="h-11 rounded-xl border-border gap-2"><Download className="w-4 h-4" /> Export Report</Button>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 border-b border-border">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Attendee</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Gateway</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-5 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.map((p) => (
                                    <tr key={p.id} className="group hover:bg-muted/10 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-bold font-mono text-foreground uppercase tracking-tight">{p.reference}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]">{p.event?.title}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary capitalize">
                                                    {p.attendee?.name?.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{p.attendee?.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{p.attendee?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <Badge variant="outline" className="text-xs font-bold border-border bg-background uppercase px-2">
                                                {p.gateway}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-muted-foreground">
                                            {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-black text-foreground">KES {parseFloat(p.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                                                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && filteredPayments.length === 0 && (
                        <div className="py-20 text-center">
                            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                            <h3 className="text-lg font-semibold text-muted-foreground">No transactions found</h3>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
};

export default PaymentsPage;
