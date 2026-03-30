import { useState, useEffect } from "react";
import { 
    Bell, 
    Calendar, 
    CreditCard, 
    Clock, 
    Loader2, 
    Check,
    Mail,
    Ticket
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { notificationService, type Notification } from "@/api/notifications";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Notifications fetch failure:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // 1 min sync
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('approve')) return Calendar;
        if (t.includes('payment') || t.includes('payout')) return CreditCard;
        if (t.includes('booking')) return Ticket;
        return Mail;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-2xl text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-md transition-all">
                    <Bell className="h-5 w-5" />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-background"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] rounded-[2rem] border-white/20 glass-effect p-0 overflow-hidden shadow-2xl font-sans">
                <div className="p-6 pb-4 flex items-center justify-between">
                    <div>
                        <DropdownMenuLabel className="text-lg font-serif font-semibold text-foreground p-0">Broadcast Center</DropdownMenuLabel>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5 opacity-60">Personalized platform activity</p>
                    </div>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleMarkAllAsRead}
                            className="h-8 px-3 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500/10 text-emerald-600"
                        >
                            Mark All Clear
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground animate-pulse flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/40 mb-3" />
                            <p className="text-xs font-medium uppercase tracking-[0.2em]">Syncing Feed...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="space-y-1 p-2">
                             <AnimatePresence initial={false}>
                                {notifications.map((n) => {
                                    const Icon = getIcon(n.title);
                                    return (
                                        <motion.div
                                            key={n.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`
                                                group relative flex items-start gap-4 p-4 rounded-3xl transition-all cursor-pointer
                                                ${!n.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/50'}
                                            `}
                                        >
                                            <div className={`
                                                mt-0.5 h-10 w-10 flex items-center justify-center rounded-2xl shrink-0 transition-transform group-hover:scale-105
                                                ${!n.isRead ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground'}
                                            `}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-sm font-semibold truncate leading-none ${!n.isRead ? 'text-foreground' : 'text-muted-foreground opacity-80'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />}
                                                </div>
                                                <p className={`text-xs leading-relaxed line-clamp-2 ${!n.isRead ? 'text-muted-foreground font-medium' : 'text-muted-foreground/60'}`}>
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/40 italic uppercase tracking-widest pt-1">
                                                    <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(n.createdAt))} ago
                                                </div>
                                            </div>
                                            {!n.isRead && (
                                                <button 
                                                    onClick={(e) => handleMarkAsRead(n.id, e)}
                                                    className="absolute top-4 right-4 h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-emerald-500 hover:text-white"
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            )}
                                        </motion.div>
                                    );
                                })}
                             </AnimatePresence>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-border">
                                <Bell className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <p className="text-sm font-serif font-medium text-foreground italic">Your inbox is currently serene.</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2 opacity-40">No new alerts detected</p>
                        </div>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="p-4 bg-muted/10">
                     <Button 
                        variant="ghost" 
                        className="w-full h-12 rounded-2xl text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
                    >
                        Enter Notification Lab
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;
