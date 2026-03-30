import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Filter, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { eventService } from '@/api/events';
import { API_BASE_URL } from '@/api/apiConfig';

const ExplorePage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('search') || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const params = searchQuery ? { search: searchQuery } : {};
                const data = await eventService.getPublicEvents(params);
                
                const formatted = data.map((event: any) => {
                    const minPrice = event.tickets && event.tickets.length > 0
                        ? Math.min(...event.tickets.map((t: any) => {
                            const p = typeof t.price === 'string' ? parseFloat(t.price) : t.price;
                            return isNaN(p) ? 0 : p;
                        })) : 0;

                    let image = event.image;
                    if (image && image.startsWith('/uploads')) {
                        image = `${API_BASE_URL}${image}`;
                    }

                    return {
                        ...event,
                        formattedDate: new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        }),
                        priceLabel: minPrice > 0 ? `KES ${minPrice}` : "Free",
                        image: image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"
                    };
                });
                setEvents(formatted);
            } catch (err) {
                console.error("Explore fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchEvents, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val) {
            setSearchParams({ search: val });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />
            
            {/* Header Section */}
            <header className="relative py-12 md:py-16 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-[radial-gradient(var(--primary)/5%_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
                    >
                        <Sparkles className="h-3 w-3" />
                        Live Experiences
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-normal text-foreground tracking-tight mb-8"
                    >
                        Explore <span className="text-primary underline decoration-primary/20 decoration-2 underline-offset-8">Events</span>
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="glass-effect relative flex items-center rounded-2xl border border-border p-1.5 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all max-w-xl mx-auto">
                            <Search className="ml-3.5 h-4 w-4 text-muted-foreground/60" />
                            <Input 
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="border-0 bg-transparent text-base py-6 focus-visible:ring-0 placeholder:text-muted-foreground/40 h-10"
                            />
                            <Button className="rounded-xl px-6 h-10 text-xs font-bold shadow-md shadow-primary/10">
                                Search
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {loading ? "Searching..." : `${events.length} Results Found`}
                    </h2>
                    <Button variant="outline" className="rounded-xl gap-2 h-11 border-border/50">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Curating events for you...</p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group glass-effect rounded-[2.5rem] border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col shadow-xl cursor-pointer"
                                onClick={() => navigate(`/events/${event.id}`)}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={event.image} 
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    <Badge className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border-white/20 text-white">
                                        {event.category || "General"}
                                    </Badge>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {event.formattedDate}
                                    </div>
                                    <h3 className="text-2xl font-serif font-normal text-foreground group-hover:text-primary transition-colors leading-tight mb-4">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6 mt-auto">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                        <div className="text-2xl font-black text-foreground">
                                            {event.priceLabel}
                                        </div>
                                        <Button variant="link" className="text-primary font-bold p-0 h-auto">
                                            Get Tickets →
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-border rounded-3xl">
                        <div className="p-10 inline-flex rounded-full bg-muted/50 mb-6 font-serif text-4xl text-muted-foreground/30 font-bold">
                            :(
                        </div>
                        <h3 className="text-2xl font-serif font-normal text-foreground mb-2">No events found</h3>
                        <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-primary font-bold underline">
                            Clear all filters
                        </Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ExplorePage;
