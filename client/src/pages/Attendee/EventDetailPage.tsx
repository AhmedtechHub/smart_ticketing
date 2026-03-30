import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService, type Event } from "@/api/events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
    Calendar, 
    MapPin, 
    Ticket, 
    Users, 
    ArrowLeft, 
    ShieldCheck,
    Info,
    Minus,
    Plus,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL, authClient } from "@/api/apiConfig";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { data: session } = authClient.useSession();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const data = await eventService.getEventDetails(id);
                setEvent(data);
                if (data.tickets && data.tickets.length > 0) {
                    setSelectedTicketId(data.tickets[0].id || null);
                }
            } catch (err) {
                console.error(err);
                toast({ variant: "destructive", title: "Error", description: "Event not found" });
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleProceed = async () => {
        if (!session) {
            toast({ title: "Authentication Required", description: "Please login to purchase tickets." });
            navigate("/login");
            return;
        }

        if (!selectedTicketId) {
            toast({ variant: "destructive", title: "Selection Missing", description: "Please select a ticket category." });
            return;
        }

        // Navigate to checkout with selections
        // Use state or URL params. Let's use state if possible or just params.
        // Actually, let's just go to checkout and pass these as state
        const selectedTicket = event?.tickets?.find(t => t.id === selectedTicketId);
        navigate(`/checkout/${id}`, { 
            state: { 
                ticketId: selectedTicketId, 
                quantity,
                ticketType: selectedTicket?.type,
                price: selectedTicket?.price
            } 
        });
    };

    const selectedTicket = event?.tickets?.find(t => t.id === selectedTicketId);
    const availableTickets = selectedTicket ? (selectedTicket.quantity - (selectedTicket.sold || 0)) : 0;

    useEffect(() => {
        if (quantity > availableTickets && availableTickets > 0) {
            setQuantity(availableTickets);
        } else if (availableTickets === 0 && quantity > 0) {
            setQuantity(0); // Should ideally handle sold out state in UI
        }
    }, [selectedTicketId, availableTickets]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <h2 className="text-2xl font-serif font-medium">Event not found</h2>
                <Button onClick={() => navigate("/")} className="mt-4">Back to Landing</Button>
            </div>
        </div>
    );

    const eventImage = event.image 
        ? (event.image.startsWith('http') ? event.image : `${API_BASE_URL}${event.image}`)
        : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />
            
            <main className="container mx-auto px-6 py-12 max-w-7xl">
                {/* Back Button */}
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(-1)}
                    className="mb-8 rounded-xl glass-effect group hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Explore
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Image & Details */}
                    <div className="lg:col-span-2 space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
                        >
                            <img src={eventImage} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10">
                                <Badge className="mb-4 bg-primary/20 backdrop-blur-xl border-white/20 text-white uppercase tracking-widest text-[10px] font-medium px-4 py-1.5">
                                    Verified Gathering
                                </Badge>
                                <h1 className="text-5xl font-serif font-medium text-white tracking-tight">{event.title}</h1>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="rounded-[2rem] glass-effect border-white/5 p-8">
                                <h3 className="text-sm font-medium uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> About Experience
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {event.description || "Join us for an unforgettable experience at our premier venue. This curated gathering promises exceptional connections and world-class atmosphere."}
                                </p>
                            </Card>

                            <Card className="rounded-[2rem] glass-effect border-white/5 p-8">
                                <h3 className="text-sm font-medium uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Logistics
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase">Date</p>
                                            <p className="font-medium">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase">Venue</p>
                                            <p className="font-medium">{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Ticket Selection */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-28 space-y-6"
                        >
                            <Card className="rounded-[2.5rem] glass-effect border border-primary/20 p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                    <Ticket className="w-32 h-32 text-primary" />
                                </div>
                                
                                <h2 className="text-2xl font-serif font-medium mb-8 tracking-tight">Secure Tickets</h2>
                                
                                <div className="space-y-4 mb-8">
                                    {event.tickets?.map((t) => {
                                        const isSoldOut = (t.quantity! - t.sold!) <= 0;
                                        return (
                                            <div 
                                                key={t.id} 
                                                onClick={() => !isSoldOut && setSelectedTicketId(t.id || null)}
                                                className={`
                                                    relative cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300
                                                    ${selectedTicketId === t.id 
                                                        ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' 
                                                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                                                    ${isSoldOut ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                                `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-medium text-lg">{t.type}</h4>
                                                        <p className="text-[10px] uppercase font-medium tracking-widest mt-1">
                                                            {isSoldOut ? (
                                                                <span className="text-destructive">Sold Out</span>
                                                            ) : (
                                                                <span className="text-muted-foreground">{t.quantity! - t.sold!} Remaining</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-xl font-serif font-medium text-primary">
                                                        KES {t.price}
                                                    </div>
                                                </div>
                                                {selectedTicketId === t.id && (
                                                    <motion.div 
                                                        layoutId="tick"
                                                        className="absolute -right-2 -top-2 bg-primary text-white p-1.5 rounded-full shadow-lg"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-between gap-6 mb-8">
                                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Quantity</span>
                                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-1.5 px-4 shadow-inner">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="h-8 w-8 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-30"
                                            disabled={quantity <= 1 || availableTickets === 0}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-lg font-medium min-w-[2ch] text-center">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                                            className="h-8 w-8 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-30"
                                            disabled={quantity >= availableTickets || availableTickets === 0}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleProceed}
                                    disabled={availableTickets === 0 || quantity === 0}
                                    className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-medium uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:grayscale"
                                >
                                    {availableTickets === 0 ? "Sold Out" : "Proceed to Checkout"}
                                </Button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" /> Secure Transaction Guaranteed
                                </div>
                            </Card>

                            <div className="flex items-center gap-4 p-6 glass-effect rounded-[2rem] border border-white/5">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Users className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-medium leading-relaxed">
                                    Join <span className="text-emerald-500 font-medium">{event._count?.bookings || 0} attendees</span> already confirmed for this event.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EventDetailPage;
