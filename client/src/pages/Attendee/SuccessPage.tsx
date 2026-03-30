import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { eventService } from "@/api/events";
import { Button } from "@/components/ui/button";
import { 
    Trophy, 
    Download, 
    Hash, 
    CheckCircle2,
    Loader2
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
            <div className="min-h-screen bg-background flex flex-col">
                 <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Synchronizing Manifest...</p>
                 </div>
                 <Footer />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                 <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
                        <Hash className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-serif font-medium mb-4">Manifest Not Found</h2>
                    <p className="text-muted-foreground mb-8">We couldn't locate your transaction details. If you just paid, please check your email.</p>
                    <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl h-12 px-8">Return to Explore</Button>
                 </div>
                 <Footer />
            </div>
        );
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}${booking?.qrCode}`;
        link.download = `Ticket_${booking?.reference}.png`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-background font-sans overflow-x-hidden">
            <Navigation isLoggedIn={!!session} userRole={(session?.user as any)?.role?.toLowerCase()} />
            
            <main className="container mx-auto px-6 py-12 lg:py-32 max-w-4xl">
                <div className="flex flex-col items-center text-center">
                    
                    {/* Success Message Body */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="space-y-12 w-full flex flex-col items-center"
                    >
                        {/* Celebrate Icon */}
                        <div className="relative">
                            <motion.div 
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/20 to-primary/20 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/10 relative z-10 box-glow"
                            >
                                <Trophy className="w-12 h-12" />
                            </motion.div>
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.4, 0.2]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-primary/20 blur-3xl -z-10"
                            />
                        </div>

                        {/* Textual Content */}
                        <div className="space-y-6 max-w-2xl">
                            <h1 className="text-6xl md:text-7xl font-serif font-medium tracking-tight text-foreground leading-[1.05]">
                                Access <span className="text-primary italic">Granted.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                                Your confirmation for <span className="text-foreground font-bold underline underline-offset-8 decoration-primary/40 decoration-2">{booking.event.title}</span> is complete.
                            </p>
                        </div>

                        {/* Interactive Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
                             <Button 
                                onClick={handleDownload}
                                className="h-20 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_rgba(var(--primary),0.4)] transition-all flex-1 group"
                            >
                                <Download className="mr-3 w-5 h-5 group-hover:translate-y-1 transition-transform" /> 
                                Get Official Ticket
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => navigate("/")}
                                className="h-20 px-10 rounded-2xl border-white/10 glass-effect font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white/5 transition-all flex-1"
                            >
                                Continue Exploring
                            </Button>
                        </div>

                        {/* Confirmation Footer */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="pt-12 border-t border-border/50 w-full max-w-2xl"
                        >
                             <div className="flex items-start gap-5 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 text-left shadow-inner">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-foreground">Next Steps</p>
                                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                        Your digital credentials have been dispatched to <span className="text-primary font-bold">{session?.user?.email}</span>. Simply present the QR code from the downloaded file at the venue for instant entry.
                                    </p>
                                </div>
                             </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SuccessPage;
