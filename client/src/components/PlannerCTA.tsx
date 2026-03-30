import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PERKS = [
  "Instant ticket sales with zero setup fees",
  "Built-in attendee management dashboard",
  "Real-time analytics & payout reports",
];

const IMAGE_URL =
  "https://res.cloudinary.com/dvkt0lsqb/image/upload/v1774340332/pexels-luis-felipe-perez-817377805-19408256_fkldoi.jpg";

export default function PlannerCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32 font-sans">
      {/* subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">

          {/* ── LEFT — Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full lg:w-1/2 flex-shrink-0"
          >
            {/* decorative glow */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={IMAGE_URL}
                alt="Event planners at a live event"
                className="h-[480px] w-full object-cover"
              />
              {/* bottom-left badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl glass-effect border border-white/20 px-5 py-3 shadow-lg">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_2px] shadow-primary/60 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Live events happening now
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — Text & CTA ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            className="flex flex-col w-full lg:w-1/2"
          >
            {/* eyebrow */}
            <span className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              For Event Planners
            </span>

            {/* headline — mirrors the "Tailored for your role" style */}
            <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl lg:text-6xl">
              Your events,{" "}
              <span className="text-primary">perfectly</span>
              <br className="hidden sm:block" /> orchestrated.
            </h2>

            <p className="mt-6 max-w-lg font-sans font-medium text-foreground/60 text-lg leading-relaxed">
              Join thousands of planners who use our platform to sell tickets,
              grow audiences, and deliver unforgettable experiences — all from
              one powerful dashboard.
            </p>

            {/* perks */}
            <ul className="mt-8 space-y-3">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  {perk}
                </li>
              ))}
            </ul>

             {/* CTA row */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/#contact');
                  }
                }}
                className="h-14 gap-2 rounded-2xl px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
              >
                Get Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                onClick={() => navigate("/pricing")}
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline transition-all"
              >
                View pricing plans →
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
