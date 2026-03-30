import { useState } from "react";
import PageShell from "../Components/PageShell";
import { notificationService } from "@/api/notifications";
import { 
  Bell, 
  Send, 
  Users, 
  Shield, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

const NotificationsPage = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [recipientRole, setRecipientRole] = useState("all");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await notificationService.broadcast({ 
                title: subject, 
                message, 
                role: recipientRole === 'all' ? undefined : recipientRole,
                sendEmail: true
            });
            setSuccess(true);
            setSubject("");
            setMessage("");
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <PageShell
            title="Communications Hub"
            description="Send system-wide broadcasts, role-specific reminders, or in-app notices."
            icon={Bell}
        >
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Broadcast Form */}
                <div className="xl:col-span-3 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl border border-border p-6 shadow-sm"
                    >
                        <form onSubmit={handleBroadcast} className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Send className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Send Broadcast</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Global email & in-app notification</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {success && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <p className="text-sm font-bold text-emerald-600">Broadcast sent successfully! All selected users have been notified.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" /> Recipient Audience
                                    </label>
                                    <Select value={recipientRole} onValueChange={setRecipientRole}>
                                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border">
                                            <SelectValue placeholder="Select target role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="font-bold">Every One (All Users)</SelectItem>
                                            <SelectItem value="ADMIN" className="font-bold text-purple-600">Administrators Only</SelectItem>
                                            <SelectItem value="PLANNER" className="font-bold text-blue-600">Event Planners Only</SelectItem>
                                            <SelectItem value="ATTENDEE" className="font-bold text-slate-600">Attendees Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" /> Subject Line
                                    </label>
                                    <Input 
                                        required
                                        placeholder="e.g. Important Update: Platform Maintenance" 
                                        className="h-11 rounded-xl bg-muted/20 border-border"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" /> Announcement Message
                                    </label>
                                    <Textarea 
                                        required
                                        rows={6}
                                        placeholder="Type your message here... You can use HTML formatting." 
                                        className="rounded-xl bg-muted/20 border-border resize-none p-4"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button 
                                disabled={sending}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark font-black tracking-widest uppercase gap-2 shadow-lg shadow-primary/20"
                            >
                                {sending ? "Dispatching..." : (
                                    <>DISPATCH NOTIFICATION <Send className="w-4 h-4" /></>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>

                {/* Automation & Insights */}
                <div className="xl:col-span-2 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-2xl border border-border p-6 shadow-sm overflow-hidden relative"
                    >
                        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                            <Bell className="w-32 h-32 text-primary" />
                        </div>
                        <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                            <AlertCircle className="w-4 h-4 text-amber-500" /> Reminder Automations
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: "Ticket Purchase Confirmation", active: true },
                                { label: "Event Reminder (24h before)", active: true },
                                { label: "Password Reset Request", active: true },
                                { label: "Refund Notice", active: false }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                                    <span className="text-sm font-semibold">{item.label}</span>
                                    <div className={`h-2 w-2 rounded-full ${item.active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-muted'}`} />
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 h-10 rounded-xl text-xs font-bold uppercase tracking-wider text-primary bg-primary/5">Configure Automations</Button>
                    </motion.div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                            <Shield className="w-4 h-4 text-primary" /> Delivery Stats
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deliverability</p>
                                <p className="text-xl font-black text-foreground">99.2%</p>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '99.2%' }} className="h-full bg-emerald-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 rounded-xl bg-muted/10 border border-border/50">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sent Mails</p>
                                    <p className="text-lg font-black mt-1">124k</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/10 border border-border/50">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Open Rate</p>
                                    <p className="text-lg font-black mt-1">42%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default NotificationsPage;
