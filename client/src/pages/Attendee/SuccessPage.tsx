import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { eventService } from "@/api/events";
import { Button } from "@/components/ui/button";
import { 
    Trophy, 
    Download, 
    Hash, 
    CheckCircle2,
    Loader2,
    Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/api/apiConfig";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { authClient } from "@/api/apiConfig";

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [booking, setBooking] = useState<any>(location.state?.booking || null);
    const [loading, setLoading] = useState(!booking);
    const { data: session } = authClient.useSession();

    useEffect(() => {
        const fetchBooking = async () => {
            const reference = searchParams.get('reference');
            if (!booking && reference) {
                try {
                    const data = await eventService.getBookingByReference(reference);
                    setBooking(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else if (!booking) {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [booking, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                 <Loader2 className="w-12 h-12 animate-spin text-primary" />
                 <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Manifest...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                 <Navigation isLoggedIn={!!session} userRole={(session?.user as any)?.role?.toLowerCase()} />
                 <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-8">
                        <Hash className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-serif font-medium mb-4 tracking-tight">Receipt Not Found</h2>
                    <p className="text-muted-foreground mb-10 max-w-sm text-lg">We couldn't locate your transaction details. If you just paid, please check your inbox for the confirmation email.</p>
                    <Button onClick={() => navigate("/")} className="rounded-2xl h-16 px-10 text-[11px] font-bold uppercase tracking-widest">Return to Browse</Button>
                 </div>
            </div>
        );
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}${booking?.qrCode}`;
        link.download = `Ticket_${booking?.reference}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary selection:text-white">
            <Navigation isLoggedIn={!!session} userRole={(session?.user as any)?.role?.toLowerCase()} />
            
            <main className="container mx-auto px-6 py-16 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left Side: Confirmation Content */}
                    <div className="lg:col-span-7 flex flex-col items-start space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 shadow-sm shadow-emerald-500/5">
                                <CheckCircle2 className="h-4 w-4" />
                                Payment Verified
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight text-foreground leading-[0.95]">
                                Your spot <br/>
                                is <span className="text-primary italic">secured.</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                                Congratulations! You are officially attending <span className="text-foreground font-bold underline underline-offset-8 decoration-primary/30 decoration-2">{booking.event.title}</span>.
                            </p>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-6 w-full lg:max-w-xl">
                             <Button 
                                onClick={handleDownload}
                                className="h-20 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(var(--primary),0.25)] hover:shadow-[0_25px_50px_rgba(var(--primary),0.35)] transition-all flex-1 group"
                            >
                                <Download className="mr-3 w-5 h-5 group-hover:translate-y-1 transition-transform" /> 
                                Get Official Pass
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => navigate("/")}
                                className="h-20 px-10 rounded-[1.5rem] border-border bg-white/5 glass-effect font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 transition-all flex-1"
                            >
                                Continue Exploring
                            </Button>
                        </div>

                        {/* Order Details Mini-Table */}
                        <div className="w-full lg:max-w-xl p-8 rounded-[2.5rem] border border-border bg-muted/20 backdrop-blur-3xl space-y-8 glass-effect">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Manifest Details</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                    <span className="text-sm font-medium text-muted-foreground">Order Reference</span>
                                    <span className="text-sm font-bold font-mono tracking-tighter">{booking.reference}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                    <span className="text-sm font-medium text-muted-foreground">Tier</span>
                                    <span className="text-sm font-bold uppercase tracking-widest text-primary">{booking.ticket.type}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                    <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                                    <span className="text-sm font-bold">{booking.quantity}x Tickets</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-medium text-muted-foreground">Total Paid</span>
                                    <span className="text-2xl font-serif font-medium tracking-tight">KSH {Number(booking.amount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-left max-w-xl">
                            <Mail className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground">Digital Fulfillment</p>
                                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                    A copy of your ticket and receipt has been dispatched to <span className="text-primary font-bold">{booking.attendee?.email || 'your email'}</span>. You can also download it right now using the button above.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Virtual Ticket Pass Visualizer */}
                    <div className="lg:col-span-5 flex justify-center">
                        <motion.div 
                            initial={{ opacity: 0, rotate: 2, y: 40 }}
                            animate={{ opacity: 1, rotate: -2, y: 0 }}
                            transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                            className="relative group"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -inset-10 bg-primary/20 blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity" />
                            
                            {/* Pass Card */}
                            <div className="relative w-[380px] h-[580px] bg-[#1a1a1a] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                                <div className="h-[280px] bg-primary relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                     {booking.event.image ? (
                                         <img src={`${API_BASE_URL}${booking.event.image}`} alt="" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
                                     ) : (
                                         <div className="w-full h-full bg-primary/20 flex items-center justify-center text-white/10 uppercase font-serif text-8xl rotate-12">PASS</div>
                                     )}
                                     <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70 mb-2">Reserved Entry</p>
                                        <h2 className="text-3xl font-serif font-medium leading-none tracking-tight">{booking.event.title}</h2>
                                     </div>
                                </div>
                                <div className="flex-1 p-8 space-y-8 flex flex-col justify-between">
                                    <div className="grid grid-cols-2 gap-8 border-b border-white/5 pb-8">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Row/Tier</p>
                                            <p className="text-sm font-bold text-white uppercase">{booking.ticket.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Gate</p>
                                            <p className="text-sm font-bold text-white uppercase">Main North</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center p-6 bg-white rounded-[2rem] border-4 border-primary/20">
                                         <img src={`${API_BASE_URL}${booking.qrCode}`} alt="QR Code" className="w-32 h-32" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">Official Access Pass</p>
                                        <p className="text-[10px] font-mono text-white/40">{booking.reference}</p>
                                    </div>
                                </div>

                                {/* Ticket Cutout Effects */}
                                <div className="absolute top-[280px] -left-5 h-10 w-10 bg-background rounded-full border-r border-white/10 shadow-inner" />
                                <div className="absolute top-[280px] -right-5 h-10 w-10 bg-background rounded-full border-l border-white/10 shadow-inner" />
                                <div className="absolute top-[284px] left-8 right-8 border-t border-dashed border-white/20" />
                            </div>
                            
                            {/* Floating Accessories */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-primary/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-primary shadow-2xl"
                            >
                                <Trophy className="h-8 w-8" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SuccessPage;
