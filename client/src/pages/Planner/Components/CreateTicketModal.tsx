import { useState, useEffect } from "react";
import { eventService, type Event } from "@/api/events";
import { 
    Ticket, 
    Layers,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTicketCreated: () => void;
}

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) => {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchEvents();
        }
    }, [isOpen]);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getMyEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await eventService.createTicket({
                eventId,
                type,
                price: Number(price),
                quantity: Number(quantity)
            });
            toast({
                title: "Tier Deployed",
                description: "New ticket category has been integrated into the project.",
            });
            onTicketCreated();
            onClose();
            // Reset form
            setEventId("");
            setType("");
            setPrice("");
            setQuantity("");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Integration Failed",
                description: "Please verify the tier parameters and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2.5rem] border-border glass-effect bg-card/95">
                <DialogHeader className="p-8 pb-0 flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Ticket className="w-8 h-8" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-serif font-semibold tracking-tight text-foreground">Configure Tier</DialogTitle>
                        <DialogDescription className="text-xs font-medium uppercase tracking-[0.2em] text-foreground opacity-100 mt-1">
                            Launch dynamic pricing configurations
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="event" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1 flex items-center gap-2">
                          <Layers className="w-3 h-3" /> Target Project
                        </Label>
                        <Select value={eventId} onValueChange={setEventId}>
                            <SelectTrigger className="h-12 rounded-2xl bg-muted/20 border-border text-foreground">
                                <SelectValue placeholder="Select an event container" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl glass-effect border-border text-foreground">
                                {events.map(event => (
                                    <SelectItem key={event.id} value={event.id} className="rounded-xl py-3 cursor-pointer">
                                        {event.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Tier Category</Label>
                            <Input
                                id="type"
                                placeholder="e.g. Early Bird, VIP, VVIP"
                                className="h-12 rounded-2xl bg-muted/20 border-border text-foreground"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Valuation (KES)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    className="h-12 rounded-2xl bg-muted/20 border-border text-foreground"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Inventory Qty</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="Limit"
                                    className="h-12 rounded-2xl bg-muted/20 border-border text-foreground"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="h-12 px-6 rounded-2xl font-semibold uppercase tracking-widest text-[10px] text-foreground"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading || !eventId || !type || !price || !quantity}
                            className="h-12 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                "Deploy Tier"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTicketModal;
