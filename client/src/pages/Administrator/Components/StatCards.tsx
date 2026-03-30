import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface StatCardsProps {
  data?: {
    totalUsers: number;
    totalEvents: number;
    pendingEvents: number;
    totalRevenue: number;
  };
}

const StatCards = ({ data }: StatCardsProps) => {
  const stats = [
    {
      title: "Total Revenue",
      value: data ? `KES ${data.totalRevenue.toLocaleString()}` : "KES 0",
      change: "+15.2%",
      positive: true,
      icon: CreditCard,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "All Events",
      value: data ? data.totalEvents.toLocaleString() : "0",
      change: "+3.4%",
      positive: true,
      icon: CalendarCheck,
      iconBg: "bg-chart-2/20",
      iconColor: "text-chart-2",
    },
    {
      title: "Total Users",
      value: data ? data.totalUsers.toLocaleString() : "0",
      change: "+12%",
      positive: true,
      icon: Users,
      iconBg: "bg-chart-3/20",
      iconColor: "text-chart-3",
    },
    {
      title: "Pending Approvals",
      value: data ? data.pendingEvents.toLocaleString() : "0",
      change: "",
      positive: data ? data.pendingEvents === 0 : true,
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="pointer-events-none absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-colors duration-300 rounded-2xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </span>
              {stat.change && (
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    stat.positive
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {stat.positive
                    ? <TrendingUp className="h-3 w-3" />
                    : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
              View Details <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
