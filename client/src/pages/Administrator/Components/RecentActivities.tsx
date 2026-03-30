import { useState, useEffect } from "react";
import { 
    Calendar, 
    CreditCard, 
    Loader2,
    Activity as ActivityIcon
} from "lucide-react";
import { notificationService, type Activity } from "@/api/notifications";
import { formatDistanceToNow } from "date-fns";

const ActivityItem = ({ activity, isLast }: { activity: Activity, isLast: boolean }) => {
    const getIcon = () => {
        switch (activity.type) {
            case 'booking':
                return {
                    icon: CreditCard,
                    bg: "bg-emerald-500/10",
                    color: "text-emerald-500"
                };
            case 'event':
                return {
                    icon: Calendar,
                    bg: "bg-primary/10",
                    color: "text-primary"
                };
            default:
                return {
                    icon: ActivityIcon,
                    bg: "bg-muted",
                    color: "text-muted-foreground"
                };
        }
    };

    const config = getIcon();

    return (
        <li
          className={`flex items-start gap-4 rounded-xl p-4 transition-all hover:bg-accent/50 group ${
            !isLast ? "border-b border-border/40" : ""
          }`}
        >
          {/* Icon */}
          <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 ${config.bg}`}>
            <config.icon className={`h-5 w-5 ${config.color}`} />
          </span>

          {/* Text */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground truncate uppercase tracking-tighter">{activity.title}</p>
                <span className="shrink-0 text-[10px] font-medium text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-0.5 rounded-full">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                {activity.description}
            </p>
            {activity.amount && (
                 <p className="text-[10px] font-bold text-emerald-600 bg-emerald-500/5 inline-block px-2 py-0.5 rounded">
                    KES {Number(activity.amount).toLocaleString()}
                 </p>
            )}
          </div>
        </li>
    );
};

const RecentActivities = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const data = await notificationService.getRecentActivities();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        const interval = setInterval(fetchActivities, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex h-full flex-col rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-sm text-card-foreground p-8 shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
                Live Console
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1 opacity-70">Real-time system telemetry</p>
          </div>
          <button className="h-10 px-4 rounded-xl glass-effect text-[10px] font-bold tracking-widest uppercase text-primary hover:bg-primary/10 transition-all border border-primary/20">
            Full Manifest
          </button>
        </div>

        {/* Activity list */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="space-y-1">
                {loading ? (
                    <div className="h-full flex items-center justify-center py-20 text-muted-foreground animate-pulse">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40 mr-3" />
                        <span className="text-sm font-medium tracking-widest uppercase">Syncing Stream...</span>
                    </div>
                ) : activities.length > 0 ? (
                    activities.map((act, idx) => (
                        <ActivityItem 
                            key={act.id} 
                            activity={act} 
                            isLast={idx === activities.length - 1} 
                        />
                    ))
                ) : (
                    <div className="text-center py-20 opacity-40">
                        <ActivityIcon className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-sm font-medium">No system activity detected yet</p>
                    </div>
                )}
            </ul>
        </div>
      </div>
    );
};

export default RecentActivities;
