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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { adminApi } from "@/api/adminApi";
import { UserPlus, Loader2 } from "lucide-react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal = ({ isOpen, onClose, onUserCreated }: CreateUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "ATTENDEE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.createUser(formData);
      onUserCreated();
      setFormData({ name: "", email: "", role: "ATTENDEE" });
      onClose();
    } catch (error) {
      console.error("Failed to create user:", error);
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black">Add New User</DialogTitle>
              <DialogDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Provision a new platform account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Full Name
              </Label>
              <Input
                id="name"
                required
                placeholder="John Doe"
                className="h-11 rounded-xl bg-muted/20 border-border"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                className="h-11 rounded-xl bg-muted/20 border-border"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                System Role
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border font-semibold">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="ATTENDEE" className="font-semibold">Attendee (Normal User)</SelectItem>
                  <SelectItem value="PLANNER" className="font-semibold text-blue-600">Event Planner</SelectItem>
                  <SelectItem value="ADMIN" className="font-semibold text-purple-600">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
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
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
