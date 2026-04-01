import { useState, useEffect } from "react";
import { adminApi } from "@/api/adminApi";
import { 
    Mail, 
    Calendar, 
    User, 
    MessageSquare, 
    Loader2, 
    CheckCircle2,
    Search,
    Clock,
    Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const MessagesPage = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getInquiries();
            setInquiries(data);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch messages." });
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await adminApi.markInquiryRead(id);
            setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, isRead: true } : inq));
            if (selectedInquiry?.id === id) {
                setSelectedInquiry({ ...selectedInquiry, isRead: true });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredInquiries = inquiries.filter(inq => 
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectInquiry = (inquiry: any) => {
        setSelectedInquiry(inquiry);
        if (!inquiry.isRead) {
            markAsRead(inquiry.id);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-medium tracking-tight text-foreground">Message Center</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage event quote requests and customer inquiries</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Filter inquiries..." 
                            className="pl-10 h-11 w-64 rounded-xl border-border bg-muted/30 focus-visible:ring-primary/20 glass-effect"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchInquiries} variant="outline" className="h-11 rounded-xl border-primary/20 hover:bg-primary/5">
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inquiry List */}
                <Card className="lg:col-span-5 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-3xl p-6 h-[700px] flex flex-col overflow-hidden">
                    <div className="mb-4 flex items-center justify-between px-2">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Recent Inquiries</h2>
                        <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/10">
                            {inquiries.filter(i => !i.isRead).length} New
                        </Badge>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredInquiries.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                                <MessageSquare className="h-12 w-12 mb-4" />
                                <p className="font-medium">No messages found</p>
                            </div>
                        ) : (
                            filteredInquiries.map((inquiry) => (
                                <motion.div
                                    key={inquiry.id}
                                    whileHover={{ scale: 1.01, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelectInquiry(inquiry)}
                                    className={`p-5 rounded-[1.5rem] cursor-pointer transition-all border group relative
                                        ${selectedInquiry?.id === inquiry.id 
                                            ? 'bg-primary/10 border-primary shadow-xl shadow-primary/5' 
                                            : !inquiry.isRead ? 'bg-muted border-primary/30 flex' : 'bg-transparent border-white/5 hover:bg-muted/50'}
                                    `}
                                >
                                    {!inquiry.isRead && (
                                        <div className="absolute right-6 top-6 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                    )}
                                    <div className="flex gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0
                                            ${!inquiry.isRead ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}
                                        `}>
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-sm truncate">{inquiry.name}</h3>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter shrink-0 ml-2">
                                                    {format(new Date(inquiry.createdAt), 'MMM d, p')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate font-medium">{inquiry.eventType || 'General Inquiry'}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-1 italic italic">"{inquiry.message}"</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Message Detail View */}
                <Card className="lg:col-span-7 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-3xl overflow-hidden min-h-[700px] flex flex-col relative">
                    <AnimatePresence mode="wait">
                        {selectedInquiry ? (
                            <motion.div
                                key={selectedInquiry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex-1 flex flex-col h-full"
                            >
                                {/* Header */}
                                <div className="p-10 border-b border-white/5 bg-muted/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Mail className="h-32 w-32 rotate-12" />
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/10 px-4 py-1">
                                            {selectedInquiry.eventType || 'General Inquiry'}
                                        </Badge>
                                        <Badge variant="outline" className="rounded-full bg-muted text-muted-foreground border-white/5 px-4 py-1 flex gap-2">
                                            <Clock className="w-3 h-3" /> {format(new Date(selectedInquiry.createdAt), 'PPPP')}
                                        </Badge>
                                    </div>

                                    <h2 className="text-4xl font-serif font-medium tracking-tight mb-2">{selectedInquiry.name}</h2>
                                    <div className="flex items-center gap-2 text-primary font-medium">
                                        <Mail className="w-4 h-4" /> {selectedInquiry.email}
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="p-10 flex-1 space-y-10 overflow-y-auto">
                                    {/* Quote Request Metadata */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 glass-effect group hover:border-primary/30 transition-all">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Proposed Date</p>
                                            <p className="font-semibold text-lg">{selectedInquiry.eventDate || 'N/A'}</p>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 glass-effect group hover:border-primary/30 transition-all">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Attendance</p>
                                            <p className="font-semibold text-lg">{selectedInquiry.estimatedAttendance || 'N/A'} Guests</p>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 glass-effect group hover:border-primary/30 transition-all">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                            <p className="font-semibold text-lg text-emerald-500">Captured</p>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                           <MessageSquare className="w-3 h-3" /> Inquiry Message
                                        </h3>
                                        <div className="p-8 rounded-[2rem] bg-muted/20 border border-white/5 text-lg leading-relaxed italic text-foreground font-medium italic opacity-90 relative">
                                            <span className="absolute -top-4 -left-2 text-6xl text-primary opacity-20 font-serif">"</span>
                                            {selectedInquiry.message}
                                            <span className="absolute -bottom-10 -right-2 text-6xl text-primary opacity-20 font-serif">"</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="p-8 bg-muted/10 border-t border-white/5 flex gap-4">
                                    <Button 
                                        onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                                        className="h-14 rounded-2xl flex-1 bg-primary hover:bg-primary/90 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                                    >
                                        <Mail className="mr-2 h-4 w-4" /> Reply via Email
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        className="h-14 rounded-2xl flex-1 border-white/10 glass-effect font-bold uppercase text-[10px] tracking-widest"
                                    >
                                        Archive Message
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                                <Mail className="h-24 w-24 mb-6" />
                                <h2 className="text-2xl font-serif">Select an inquiry to view details</h2>
                                <p className="text-sm font-medium mt-2">All incoming messages will appear here after database push.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </div>
    );
};

export default MessagesPage;
