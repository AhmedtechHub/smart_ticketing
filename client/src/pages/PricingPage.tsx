import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, CreditCard, Rocket, ShieldCheck, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PricingPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        eventType: "",
        eventDate: "",
        estimatedAttendance: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/attendee/quotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({
                    name: "",
                    email: "",
                    eventType: "",
                    eventDate: "",
                    estimatedAttendance: "",
                    message: ""
                });
                setSuccessPopup(true);
                setTimeout(() => {
                    setSuccessPopup(false);
                    setDialogOpen(false);
                }, 3000);
            } else {
                alert("Failed to send quote inquiry.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error sending message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const tiers = [
        {
            name: "Basic Plan",
            price: "3%",
            description: "Essential tools for smaller, focused events and community gatherings.",
            features: [
                "3% fee per sold ticket",
                "Max capacity: 1,000 attendees",
                "Free event posting",
                "Standard analytics",
                "Email support"
            ],
            cta: "Get Started",
            icon: <Sparkles className="h-6 w-6 text-primary" />,
            highlight: false
        },
        {
            name: "Standard Plan",
            price: "6%",
            description: "Optimized for medium-sized events requiring higher reach and capacity.",
            features: [
                "6% fee per sold ticket",
                "Max capacity: 2,500 attendees",
                "Priority listing",
                "Advanced attendee insights",
                "Custom ticket branding"
            ],
            cta: "Go Standard",
            icon: <Rocket className="h-6 w-6 text-primary" />,
            highlight: true
        },
        {
            name: "Pro Plan",
            price: "9%",
            description: "High-performance infrastructure for world-class, large-scale experiences.",
            features: [
                "9% fee per sold ticket",
                "Capacity: 3,000+ attendees",
                "Dedicated account manager",
                "White-label ticketing",
                "API Access & Integrations"
            ],
            cta: "Contact Sales",
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />
            
            <header className="relative py-16 md:py-20 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-[radial-gradient(var(--primary)/3%_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center text-foreground">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary"
                    >
                        <CreditCard className="h-3 w-3" />
                        Flexible Pricing
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-normal leading-tight mb-4"
                    >
                        Simple <span className="text-primary">Pricing</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-muted-foreground/80"
                    >
                        Choose the right plan to power your event. No hidden fees, just pure experience.
                    </motion.p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative flex flex-col p-10 rounded-[3rem] border transition-all duration-500 overflow-hidden ${
                                tier.highlight 
                                ? 'bg-primary/5 border-primary/40 shadow-2xl scale-[1.05]' 
                                : 'bg-card border-border hover:border-primary/30 shadow-lg'
                            }`}
                        >
                            {tier.highlight && (
                                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                            )}
                            
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-3xl ${tier.highlight ? 'bg-primary/20' : 'bg-muted/50'}`}>
                                    {tier.icon}
                                </div>
                                {tier.highlight && (
                                    <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-[10px] uppercase">
                                        Most Popular
                                    </Badge>
                                )}
                            </div>

                            <h3 className="text-3xl font-serif font-normal text-foreground mb-4">
                                {tier.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-foreground">{tier.price}</span>
                                <span className="text-muted-foreground font-medium">/sold ticket</span>
                            </div>
                            <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                                {tier.description}
                            </p>

                            <ul className="flex-1 space-y-4 mb-12">
                                {tier.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-primary/10 mt-1">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button 
                                asChild
                                className={`h-14 rounded-2xl w-full text-base font-bold shadow-xl transition-all hover:scale-[1.02] ${
                                    tier.highlight 
                                    ? 'bg-primary text-primary-foreground hover:shadow-primary/40' 
                                    : 'bg-muted text-foreground border border-border/50 hover:bg-muted/80'
                                }`}
                            >
                                <Link to="/register">{tier.cta}</Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 p-10 md:p-14 rounded-[3.5rem] bg-gradient-to-tr from-muted/50 via-background to-muted/30 border border-border/50 shadow-2xl flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10"
                >
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-serif font-normal text-foreground mb-6">Still have questions?</h2>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                            Our team is here to help you choose the best plan for your organizing needs. Reach out for a custom consultation.
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-16 rounded-3xl px-10 text-lg font-bold border-primary shadow-xl hover:bg-primary/5 transition-all">
                                Get Custom Quote
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl glass-effect border-border shadow-2xl rounded-[2rem] p-0 overflow-hidden font-sans">
                            <div className="p-8 md:p-12 relative">
                                <AnimatePresence>
                                    {successPopup && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md"
                                        >
                                            <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                                            <h3 className="text-2xl font-serif font-normal">Inquiry Sent!</h3>
                                            <p className="text-muted-foreground mt-2">We'll be in touch shortly.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <DialogHeader className="mb-8">
                                    <DialogTitle className="text-3xl font-serif font-normal text-foreground">
                                        Request a <span className="text-primary">Quote</span>
                                    </DialogTitle>
                                    <DialogDescription className="text-base font-medium text-muted-foreground">
                                        Tell us about your event vision and we'll craft a custom pricing package for you.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Your Name</label>
                                            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" className="h-12 rounded-xl bg-muted/50 border-border glass-effect" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Your Email</label>
                                            <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" className="h-12 rounded-xl bg-muted/50 border-border glass-effect" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Event Type</label>
                                            <Input name="eventType" value={formData.eventType} onChange={handleChange} required placeholder="e.g. Festival" className="h-12 rounded-xl bg-muted/50 border-border glass-effect" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Proposed Date</label>
                                            <Input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} required className="h-12 rounded-xl bg-muted/50 border-border glass-effect" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Estimated Attendance</label>
                                        <Input name="estimatedAttendance" type="number" value={formData.estimatedAttendance} onChange={handleChange} required placeholder="1000+" className="h-12 rounded-xl bg-muted/50 border-border glass-effect" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Additional Details</label>
                                        <Textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Describe your needs..." rows={4} className="rounded-xl bg-muted/50 border-border glass-effect resize-none" />
                                    </div>

                                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-base font-bold uppercase tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Send Inquiry</>}
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default PricingPage;
