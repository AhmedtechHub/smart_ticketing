import { useState, useEffect } from "react";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  subMonths, 
  addMonths, 
  format, 
  isSameMonth, 
  isSameDay 
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Reschedule Modal State
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [newDate, setNewDate] = useState("");
    const [isRescheduling, setIsRescheduling] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Failed to load events",
                description: "There was a problem syncing calendar data.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReschedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent || !newDate) return;
        
        setIsRescheduling(true);
        try {
            await adminApi.rescheduleEvent(selectedEvent.id, newDate);
            setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, date: new Date(newDate).toISOString() } : ev));
            
            toast({
                title: "Event Rescheduled",
                description: `${selectedEvent.title} moved to ${format(new Date(newDate), "PPP p")}`,
            });
            setSelectedEvent(null);
            setNewDate("");
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Rescheduling Failed",
                description: err.response?.data?.error || "Could not reschedule the event.",
            });
        } finally {
            setIsRescheduling(false);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Calendar Generation Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            const cloneDay = day;
            
            // Find events for this specific day
            const dayEvents = events.filter(e => isSameDay(new Date(e.date), cloneDay));

            days.push(
                <div 
                    key={day.toString()}
                    className={`min-h-[120px] p-2 border-r border-b border-border transition-colors hover:bg-muted/10 relative group ${
                        !isSameMonth(day, monthStart) ? "bg-muted/5 opacity-50 text-muted-foreground" : "bg-card text-foreground"
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground shadow-md' : ''}`}>
                            {formattedDate}
                        </span>
                    </div>

                    <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                        <AnimatePresence>
                            {dayEvents.map((evt) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={evt.id}
                                    onClick={() => setSelectedEvent(evt)}
                                    title="Click to Reschedule"
                                    className={`
                                        cursor-pointer truncate px-2 py-1.5 text-xs font-semibold rounded-md border shadow-sm
                                        transition-all hover:scale-[1.02] hover:shadow-md
                                        ${evt.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 
                                          evt.status === 'ARCHIVED' ? 'bg-slate-500/10 text-slate-700 border-slate-500/20' : 
                                          'bg-amber-500/10 text-amber-700 border-amber-500/20'}
                                    `}
                                >
                                    <div className="flex items-center gap-1 opacity-80 text-[10px] uppercase font-bold tracking-wider mb-0.5">
                                        <Clock className="w-2.5 h-2.5" /> 
                                        {format(new Date(evt.date), "p")}
                                    </div>
                                    <div className="truncate">{evt.title}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
    }

    return (
        <PageShell
            title="Interactive Schedule"
            description="Manage all events with a bird's eye view. Click on any event to quickly reschedule it."
            icon={CalendarIcon}
        >
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col mt-4">
                
                {/* Header Controls */}
                <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-widest bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {format(currentDate, "MMMM yyyy")}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={goToToday} className="font-bold tracking-wider uppercase text-xs">
                            Today
                        </Button>
                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border">
                            <Button variant="ghost" size="icon" onClick={prevMonth} className="w-8 h-8 rounded-md hover:bg-background">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextMonth} className="w-8 h-8 rounded-md hover:bg-background">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 border-b border-border bg-sidebar text-sidebar-foreground">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-black uppercase tracking-widest border-r border-border last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid Cells */}
                <div className="grid grid-cols-7 bg-background items-stretch min-h-[600px]">
                    {loading ? (
                        <div className="col-span-7 flex flex-col items-center justify-center py-32 opacity-50">
                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Syncing Schedule</p>
                        </div>
                    ) : (
                        days
                    )}
                </div>
            </div>

            {/* Reschedule Dialog Component */}
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-border shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black">Reschedule Event</DialogTitle>
                                <DialogDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    Change date & time for {selectedEvent?.title}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedEvent && (
                        <form onSubmit={handleReschedule} className="space-y-5 pt-2">
                            <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-2 mb-2">
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">Current:</span> 
                                    <span className="font-bold">{format(new Date(selectedEvent.date), "PPP p")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">Venue:</span> 
                                    <span className="font-bold truncate">{selectedEvent.location}</span>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="newDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    New Date & Time
                                </Label>
                                <Input
                                    id="newDate"
                                    type="datetime-local"
                                    required
                                    className="h-11 rounded-xl bg-muted/20 border-border"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>

                            <DialogFooter className="pt-4 gap-2">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setSelectedEvent(null)}
                                    className="h-11 rounded-xl font-bold uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isRescheduling || !newDate}
                                    className="h-11 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20"
                                >
                                    {isRescheduling ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Confirm Reschedule"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

        </PageShell>
    );
};

export default SchedulePage;
