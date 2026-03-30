import PageShell from "../Components/PageShell";
import { BarChart3 } from "lucide-react";

const AnalyticsPage = () => {
    return (
        <PageShell
            title="Analytics Overview"
            description="Detailed insights and performance metrics for your platform."
            icon={BarChart3}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">User Growth</h3>
                    <p className="text-3xl font-bold">2,450</p>
                    <p className="text-xs text-primary mt-1">+12% from last month</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Event Engagement</h3>
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-xs text-primary mt-1">+5% from last month</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Ticket Conversion</h3>
                    <p className="text-3xl font-bold">18.4%</p>
                    <p className="text-xs text-primary mt-1">+2% from last week</p>
                </div>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-[400px] flex items-center justify-center">
               <p className="text-muted-foreground font-medium">Advanced Charts & Heatmaps Coming Soon</p>
            </div>
        </PageShell>
    );
};

export default AnalyticsPage;
