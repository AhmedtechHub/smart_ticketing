import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import WelcomeSection from "./Components/WelcomeSection";
import StatCards from "./Components/StatCards";
import RecentActivities from "./Components/RecentActivities";
import GlobalFilter from "./Components/GlobalFilter";
import { adminApi } from "@/api/adminApi";
import type { AdminAnalytics } from "@/api/adminApi";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | undefined>();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminApi.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 font-sans"
    >
      {/* Welcome Hero */}
      <motion.div variants={item}>
        <WelcomeSection />
      </motion.div>

      {/* Filter row */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">Your platform at a glance</p>
        </div>
        <GlobalFilter />
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={item}>
        <StatCards data={analytics} />
      </motion.div>

      {/* Bottom content grid */}
      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue / chart placeholder — 2 cols */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Revenue & Ticket Sales</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Compared to previous period</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              This Week
            </span>
          </div>
          {/* Chart placeholder */}
          <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40">
            <div className="text-center space-y-2">
              <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Analytics charts coming soon</p>
              <p className="text-xs text-muted-foreground/70">Recharts integration in next milestone</p>
            </div>
          </div>
        </div>

        {/* Recent activity — 1 col */}
        <div className="xl:col-span-1">
          <RecentActivities />
        </div>

      </motion.div>
    </motion.div>
  );
};


export default AdminDashboard;
