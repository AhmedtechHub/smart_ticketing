import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { eventService } from "@/api/events";
import { 
    Calendar, 
    MapPin, 
    Image as ImageIcon, 
    Loader2, 
    ChevronLeft,
    CheckCircle2,
    X,
    CalendarCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const CreateEventPage = () => {
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("date", formData.date);
            data.append("location", formData.location);
            if (imageFile) {
                data.append("image", imageFile);
            }

            await eventService.createEvent(data);
            toast({
                title: "Event Created",
                description: "Your event has been successfully submitted for review.",
            });
            navigate("/planner/events");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to create event",
                description: "Please check your information and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8 pb-10"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-xl border border-border bg-card/50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-serif font-semibold tracking-tight">Create New Event</h1>
                        <p className="text-foreground opacity-100 text-sm">Organize and post a new experience to the platform.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[2rem] border-border bg-card shadow-sm overflow-hidden">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Event Title</Label>
                                    <Input
                                        id="title"
                                        required
                                        placeholder="Enter event name..."
                                        className="h-12 rounded-xl bg-muted/20 border-border"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Event Description</Label>
                                    <Textarea
                                        id="description"
                                        required
                                        placeholder="What is this event about?"
                                        className="min-h-[120px] rounded-xl bg-muted/20 border-border p-4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Date & Time</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100 pointer-events-none" />
                                            <Input
                                                id="date"
                                                type="datetime-local"
                                                required
                                                className="h-12 pl-10 rounded-xl bg-muted/20 border-border flex items-center pt-2.5"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Event Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-100 pointer-events-none" />
                                            <Input
                                                id="location"
                                                required
                                                placeholder="Where will it take place?"
                                                className="h-12 pl-10 rounded-xl bg-muted/20 border-border"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Cover Image</Label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                            relative border-2 border-dashed rounded-2xl p-8 
                                            flex flex-col items-center justify-center gap-3 cursor-pointer
                                            transition-all duration-300
                                            ${previewUrl ? 'border-primary/20 bg-primary/5' : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'}
                                        `}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                        />
                                        
                                        {previewUrl ? (
                                            <div className="flex items-center gap-3 text-primary font-bold text-sm">
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span>Image Selected</span>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewUrl(null);
                                                        setImageFile(null);
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <ImageIcon className="h-6 w-6" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-sm">Click to upload cover photo</p>
                                                    <p className="text-[10px] text-foreground opacity-100 mt-0.5">Recommended size: 1200x600px</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-4">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => navigate(-1)}
                                    className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Create Event"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Label className="text-xs font-medium uppercase tracking-widest text-foreground opacity-100 ml-1">Live Preview</Label>
                    <Card className="rounded-[2.5rem] border-border bg-card shadow-sm overflow-hidden group">
                        <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-foreground opacity-100 opacity-30">
                                    <CalendarCheck className="h-12 w-12" />
                                    <p className="text-xs font-bold uppercase tracking-tighter">Preview Standby</p>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className={`font-serif font-bold text-xl leading-tight ${formData.title ? 'text-foreground' : 'text-foreground opacity-100/30'}`}>
                                    {formData.title || "Your Event Title"}
                                </h3>
                                <p className={`text-xs line-clamp-2 leading-relaxed ${formData.description ? 'text-foreground opacity-100' : 'text-foreground opacity-100/20'}`}>
                                    {formData.description || "The description of your event will be displayed here for users to read..."}
                                </p>
                            </div>

                            <div className="grid gap-2 pt-2 border-t border-border/50">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-foreground opacity-100">
                                    <MapPin className="h-3 w-3 text-primary" />
                                    <span className={formData.location ? 'text-foreground' : 'opacity-30'}>
                                        {formData.location || "Venue Location"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-foreground opacity-100">
                                    <Calendar className="h-3 w-3 text-primary" />
                                    <span className={formData.date ? 'text-foreground' : 'opacity-30'}>
                                        {formData.date ? new Date(formData.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "Event Date"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border bg-primary/5 p-6 border-dashed border-2">
                        <h4 className="text-sm font-bold mb-2">Platform Protocol</h4>
                        <p className="text-xs text-foreground opacity-100 leading-relaxed">
                            Once submitted, your event will undergo a standard review process by the administration. You can monitor the status from your <span className="text-primary font-bold cursor-pointer" onClick={() => navigate("/planner/events")}>Active Events</span> dashboard.
                        </p>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateEventPage;
