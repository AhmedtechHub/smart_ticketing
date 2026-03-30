import { useState } from "react";
import { eventService } from "@/api/events";
import { 
    Calendar,
    MapPin,
    CalendarCheck,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventCreated: () => void;
}

const CreateEventModal = ({ isOpen, onClose, onEventCreated }: CreateEventModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
    });
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("date", formData.date);
            data.append("location", formData.location);

            await eventService.createEvent(data);
            toast({
                title: "Event Drafted",
                description: "Submission broadcasted for tactical review.",
            });
            onEventCreated();
            onClose();
            // Reset form
            setFormData({ title: "", description: "", date: "", location: "" });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Drafting Failed",
                description: "Critical transmission error. Please verify data integrity.",
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
                        <CalendarCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">Draft Event</DialogTitle>
                        <DialogDescription className="text-xs font-medium uppercase tracking-[0.2em] text-foreground opacity-100 mt-1">
                            Push a new experience for review
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Event Identity</Label>
                            <Input
                                id="title"
                                placeholder="Strategic Event Title"
                                className="h-12 rounded-2xl bg-muted/20 border-border"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Event Narrative</Label>
                            <Textarea
                                id="description"
                                placeholder="Mission Objectives & Context"
                                className="min-h-[100px] rounded-2xl bg-muted/20 border-border p-4 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Schedule</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100 pointer-events-none" />
                                    <Input
                                        id="date"
                                        type="datetime-local"
                                        className="h-12 pl-10 rounded-2xl bg-muted/20 border-border flex items-center pt-2.5"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100 pointer-events-none" />
                                    <Input
                                        id="location"
                                        placeholder="Tactical Venue"
                                        className="h-12 pl-10 rounded-2xl bg-muted/20 border-border"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="h-12 px-6 rounded-2xl font-semibold uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading || !formData.title || !formData.date || !formData.location}
                            className="h-12 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Draft Event"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateEventModal;
