import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { eventService } from "@/api/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
    ShieldCheck, 
    CheckCircle2, 
    Loader2, 
    ArrowLeft,
    Hash,
    Ticket,
    Download,
    Trophy,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/api/apiConfig";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CheckoutPage = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // State from selection
    const { ticketId, quantity, ticketType, price } = location.state || {};
    
    const [gateway, setGateway] = useState<'Mpesa' | 'Paystack'>('Mpesa');
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [finalTicket, setFinalTicket] = useState<any | null>(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    useEffect(() => {
        if (!ticketId) {
            navigate("/");
            toast({ variant: "destructive", title: "Error", description: "No ticket selection found." });
            return;
        }

        if (quantity > 10) {
            navigate(-1);
            toast({ 
                variant: "destructive", 
                title: "Purchase Limit Exceeded", 
                description: "For security and fair distribution, individual purchases are capped at 10 tickets per transaction." 
            });
        }
    }, [ticketId, quantity, navigate, toast]);

    const handleCheckout = async () => {
        if (quantity > 10) {
            toast({ variant: "destructive", title: "Tactical Restriction", description: "Maximum allocation of 10 tickets exceeded." });
            return;
        }

        if (gateway === 'Mpesa' && !phone.match(/^(254|\+254|0)?(7|1)\d{8}$/)) {
            toast({ variant: "destructive", title: "Invalid Phone", description: "Please enter a valid Safaricom number." });
            return;
        }

        setLoading(true);
        try {
            // Normalize phone for Mpesa
            let formattedPhone = phone;
            if (phone.startsWith('0')) formattedPhone = '254' + phone.substring(1);
            if (phone.startsWith('+')) formattedPhone = phone.substring(1);
            if (phone.startsWith('7') || phone.startsWith('1')) formattedPhone = '254' + phone;

            const res = await eventService.initializeBooking({
                eventId: eventId!,
                ticketId,
                gateway,
                phone: formattedPhone,
                quantity
            });
            
            if (gateway === 'Paystack') {
                // Redirect to Paystack secure checkout
                window.location.href = res.paymentData.authorization_url;
                return;
            }

            // For Mpesa, we show a "Processing" state and poll for completion
            setIsProcessing(true);
            toast({ title: "STK Push Sent", description: "Please check your phone and enter your M-Pesa PIN." });
            
            // Start Polling for Success
            startPolling(res.booking.id);

        } catch (err: any) {
            console.error(err);
            toast({ variant: "destructive", title: "Checkout Failed", description: err.message || "Something went wrong" });
            setLoading(false);
        }
    };

    const startPolling = (id: string) => {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            if (attempts > 30) { // 2 minutes approx
                clearInterval(interval);
                setIsProcessing(false);
                setLoading(false);
                toast({ variant: "destructive", title: "Timeout", description: "We couldn't verify payment. If you paid, please contact support." });
                return;
            }

            try {
                const booking = await eventService.getBookingDetails(id);
                if (booking.status === 'SUCCESSFUL') {
                    clearInterval(interval);
                    setIsProcessing(false);
                    setLoading(false);
                    navigate("/checkout/success", { state: { booking } });
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 4000);
    };

    const total = (price || 0) * (quantity || 1);

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />
            
            <main className="container mx-auto px-6 py-12 max-w-4xl">
                 <Button 
                    variant="ghost" 
                    onClick={() => navigate(-1)}
                    className="mb-8 rounded-xl glass-effect group font-medium"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Order
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Summary */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="rounded-[2.5rem] glass-effect border-white/5 p-10 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-3xl font-serif font-medium mb-8 tracking-tight">Order Summary</h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
                                            <Ticket className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Category</p>
                                            <p className="text-xl font-medium">{ticketType}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="py-6 border-y border-white/5 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground font-medium">Price per unit</span>
                                            <span className="font-medium">KES {price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground font-medium">Quantity</span>
                                            <span className="font-medium">x {quantity}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium text-emerald-500">
                                            <span>Booking Fee</span>
                                            <span>FREE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t-2 border-primary/20">
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Investment</span>
                                    <span className="text-5xl font-serif font-medium text-primary tracking-tighter">
                                        KES {total}
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium italic opacity-60">Inclusive of all platform taxes and security overheads.</p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right: Payment Method */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                         <Card className="rounded-[2.5rem] glass-effect border-primary/20 p-10 shadow-2xl h-full">
                            <h3 className="text-xl font-semibold mb-8 tracking-tight uppercase text-[10px] text-primary tracking-[0.2em]">Select Gateway</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div 
                                    onClick={() => setGateway('Mpesa')}
                                    className={`
                                        cursor-pointer p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3
                                        ${gateway === 'Mpesa' ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}
                                    `}
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" 
                                        alt="M-Pesa" 
                                        className="h-8 object-contain" 
                                    />
                                    <span className="text-[10px] font-medium uppercase tracking-widest">M-Pesa</span>
                                </div>
                                <div 
                                    onClick={() => setGateway('Paystack')}
                                    className={`
                                        cursor-pointer p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3
                                        ${gateway === 'Paystack' ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}
                                    `}
                                >
                                    <img 
                                        src="https://res.cloudinary.com/dvkt0lsqb/image/upload/v1771364735/visa-mastercard-logos_pra3y7.jpg" 
                                        alt="Card" 
                                        className="h-8 object-contain rounded-sm" 
                                    />
                                    <span className="text-[10px] font-medium uppercase tracking-widest">Card / Bank</span>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {gateway === 'Mpesa' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 mb-8"
                                    >
                                        <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                                        <Input 
                                            id="phone"
                                            placeholder="e.g. 0712 345 678"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 font-medium tracking-widest transition-all focus:ring-2 focus:ring-primary/40"
                                        />
                                        <p className="text-[10px] text-muted-foreground/60 italic px-2">An STK push will be sent to this device for instant authorization.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button 
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-medium uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 group disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                ) : (
                                    <>Authorize Payment <ArrowLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </Button>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[8px] font-medium uppercase tracking-widest">Bit Encryption</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[8px] font-medium uppercase tracking-widest">SSL Secure</span>
                                </div>
                            </div>
                         </Card>
                    </motion.div>
                </div>
            </main>

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 glass-effect flex flex-col items-center justify-center backdrop-blur-3xl"
                    >
                        <div className="relative mb-8">
                             <div className="h-24 w-24 rounded-full border-4 border-t-primary border-white/10 animate-spin" />
                             <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" 
                                alt="" 
                                className="absolute inset-0 m-auto w-10 h-10 object-contain" 
                             />
                        </div>
                        <h2 className="text-3xl font-serif font-medium tracking-tight mb-2">PIN Authorization</h2>
                        <p className="text-muted-foreground font-medium">Listening for M-Pesa network confirmation...</p>
                        <div className="mt-10 max-w-xs text-center space-y-4">
                             <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div 
                                    className="h-full bg-primary"
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{ duration: 120, ease: "linear" }}
                                 />
                             </div>
                             <p className="text-[10px] font-medium uppercase tracking-widest opacity-40 italic">This usually takes 10-20 seconds</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ticket Generation SUCCESS MODAL */}
            <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 rounded-[3rem] border-white/10 glass-effect overflow-hidden bg-black/80 blur-0">
                    <div className="relative p-12 flex flex-col items-center text-center">
                        <div className="absolute top-0 inset-x-0 h-1 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]" />
                        
                        <div className="mb-6 h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 animate-bounce">
                            <Trophy className="w-10 h-10" />
                        </div>

                        <h2 className="text-4xl font-serif font-medium tracking-tight mb-2">Access Granted!</h2>
                        <p className="text-muted-foreground uppercase tracking-widest font-medium text-[10px] mb-10 opacity-70">
                            You are officially on the list for <span className="text-primary italic">{finalTicket?.event?.title}</span>
                        </p>

                        {/* Modern Ticket Display */}
                        <div className="w-full bg-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                             <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-[#0a0a0a] rounded-full z-10" />
                             <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-[#0a0a0a] rounded-full z-10" />
                             
                             <div className="flex flex-col md:flex-row gap-10 items-center justify-between border-2 border-dashed border-slate-200 rounded-[1.5rem] p-6">
                                 <div className="text-left space-y-4">
                                       <div className="flex items-center gap-2 text-[10px] font-medium text-primary uppercase tracking-[0.2em]">
                                           <Sparkles className="w-3 h-3" /> Official Credentials
                                       </div>
                                       <h3 className="text-3xl font-serif font-semibold text-slate-900 leading-tight">
                                           {finalTicket?.event?.title.split(' ').map((w: string, i: number) => (
                                               <span key={i} className={i % 2 === 1 ? 'text-primary' : ''}>{w} </span>
                                           ))}
                                       </h3>
                                      <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                                <Hash className="w-4 h-4" /> {finalTicket?.reference}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-800 font-medium text-md">
                                                <Ticket className="w-4 h-4 text-primary" /> {finalTicket?.ticket?.type} Tier
                                            </div>
                                      </div>
                                 </div>

                                 <div className="shrink-0 bg-slate-50 p-6 rounded-[2rem] border-slate-100 border relative group-hover:scale-105 transition-transform duration-500">
                                      {finalTicket?.qrCode ? (
                                           <img 
                                            src={`${API_BASE_URL}${finalTicket.qrCode}`} 
                                            alt="Ticket QR" 
                                            className="w-40 h-40 mix-blend-multiply"
                                           />
                                      ) : (
                                          <div className="w-40 h-40 flex items-center justify-center text-slate-300">
                                              <Loader2 className="animate-spin" />
                                          </div>
                                      )}
                                      <p className="text-[10px] font-medium text-slate-400 mt-4 uppercase tracking-[0.2em] text-center">Validator Scan</p>
                                 </div>
                             </div>
                        </div>

                        <div className="mt-12 flex gap-4 w-full">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/")}
                                className="flex-1 h-14 rounded-2xl border-white/10 glass-effect font-medium uppercase text-[10px] tracking-widest"
                            >
                                Close Dashboard
                            </Button>
                            <Button 
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `${API_BASE_URL}${finalTicket?.qrCode}`;
                                    link.download = `Ticket_${finalTicket?.reference}.png`;
                                    link.click();
                                }}
                                className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-medium uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                            >
                                <Download className="mr-2 w-4 h-4" /> Save Ticket PNG
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
