import { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/api/adminApi";
import { Loader2, Ticket, Layers, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTicketCreated: () => void;
}

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([]);

    const [eventId, setEventId] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    // Ticket Categories matching user schema presets
    const PRESET_CATEGORIES = ["Regular", "VIP", "VVIP", "Group of 7 (Mbogi 7)", "Early Bird", "Student"];

    useEffect(() => {
        if (isOpen) {
            fetchEvents();
        }
    }, [isOpen]);

    const fetchEvents = async () => {
        try {
            const data = await adminApi.getEvents();
            const activeEvents = data.filter((e: any) => e.status !== 'ARCHIVED');
            setEvents(activeEvents);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!eventId || !type || !price || !quantity) {
            return toast({
                variant: "destructive",
                title: "Incomplete Configuration",
                description: "Ensure Event, Type, Price, and Capacity are all defined.",
            });
        }

        setLoading(true);
        try {
            await adminApi.createTicket({
                eventId,
                type,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10)
            });
            onTicketCreated();
            handleClose();
        } catch (err: any) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Creation Failed",
                description: err.response?.data?.error || "Could not spin up a new ticket tier.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEventId("");
        setType("");
        setPrice("");
        setQuantity("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl border-border shadow-2xl p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/10 to-background p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black">Configure Ticket Tier</DialogTitle>
                            <DialogDescription className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                                Launch dynamic pricing & capacity configurations
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Event Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="event" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Layers className="w-3 h-3" /> Target Event
                        </Label>
                        <Select value={eventId} onValueChange={setEventId}>
                            <SelectTrigger className="w-full h-12 bg-muted/20 border-border rounded-xl">
                                <SelectValue placeholder="Bind ticket to an active project..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 rounded-xl">
                                {events.map(ev => (
                                    <SelectItem key={ev.id} value={ev.id} className="py-3">
                                        <span className="font-semibold">{ev.title}</span> 
                                    </SelectItem>
                                ))}
                                {events.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No active events found.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tier Definition */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <Label htmlFor="type" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Category Class
                            </Label>
                            {/* Native preset selector mixed with custom support */}
                            <Input 
                                id="type" 
                                list="categories"
                                placeholder="e.g. VVIP, Mbogi 7" 
                                className="h-12 bg-muted/20 border-border rounded-xl"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                            <datalist id="categories">
                                {PRESET_CATEGORIES.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>

                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Price (KES)
                            </Label>
                            <Input 
                                id="price" 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                placeholder="0.00" 
                                className="h-12 bg-muted/20 border-border rounded-xl font-mono text-base font-bold"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Stock Capacity
                            </Label>
                            <Input 
                                id="quantity" 
                                type="number" 
                                min="1" 
                                placeholder="Maximum units to securely vend..." 
                                className="h-12 bg-muted/20 border-border rounded-xl font-mono text-base"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-1.5 opacity-80">
                                <Info className="w-3 h-3" /> Dictates absolute global max bounds
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={handleClose}
                            className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-destructive/10 hover:text-destructive"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading || !eventId || !type || !price || !quantity}
                            className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Commit Ticket Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTicketModal;
