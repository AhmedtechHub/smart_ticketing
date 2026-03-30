import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/api/adminApi";
import { CalendarCheck, Loader2 } from "lucide-react";

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
  const [imageFile, setImageFile] = useState<File | null>(null);

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

      await adminApi.createEvent(data);
      onEventCreated();
      setFormData({ title: "", description: "", date: "", location: "" });
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black">Post New Event</DialogTitle>
              <DialogDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Create a new platform event
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Event Title
            </Label>
            <Input
              id="title"
              required
              placeholder="e.g. Summer Music Festival"
              className="h-11 rounded-xl bg-muted/20 border-border"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Description
            </Label>
            <Textarea
              id="description"
              required
              placeholder="Provide a detailed description of the event..."
              className="min-h-[80px] rounded-xl bg-muted/20 border-border"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Date & Time
              </Label>
              <Input
                id="date"
                type="datetime-local"
                required
                className="h-11 rounded-xl bg-muted/20 border-border flex items-center"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Location
              </Label>
              <Input
                id="location"
                required
                placeholder="e.g. Times Square, NY"
                className="h-11 rounded-xl bg-muted/20 border-border"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Cover Image (Optional)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className="h-11 rounded-xl bg-muted/20 border-border file:bg-primary/10 file:text-primary file:border-0 file:rounded file:px-2 file:py-1 file:font-semibold flex items-center pt-2.5 cursor-pointer"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="h-11 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={loading}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Post Event"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
