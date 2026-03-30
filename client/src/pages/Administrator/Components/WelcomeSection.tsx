import { Sparkles, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const WelcomeSection = () => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground p-8 shadow-sm">

    {/* Subtle emerald glow — uses primary token */}
    <div
      aria-hidden
      className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/5 blur-2xl"
    />

    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

      {/* Text content */}
      <div className="max-w-xl space-y-4">
        {/* Pill badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          12 Events Awaiting Approval
        </span>

        <h1 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
          Welcome back,{" "}
          <span className="text-primary">Administrator</span>
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Your platform is running smoothly. You have{" "}
          <strong className="font-semibold text-foreground">12 pending events</strong> waiting for approval and{" "}
          <strong className="font-semibold text-foreground">KES 45,000</strong> queued for disbursement.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button className="rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 gap-2 font-semibold">
            Review Approvals
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-border text-foreground hover:bg-accent hover:text-accent-foreground gap-2"
          >
            <Activity className="h-4 w-4 text-muted-foreground" />
            System Log
          </Button>
        </div>
      </div>

      {/* Decorative ring — uses primary */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        aria-hidden
        className="hidden lg:flex h-48 w-48 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary/20"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-10 w-10 text-primary/60" />
        </div>
      </motion.div>

    </div>
  </div>
);

export default WelcomeSection;
