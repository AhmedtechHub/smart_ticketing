import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface PageShellProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: { label: string; onClick?: () => void };
  children: ReactNode;
}

const PageShell = ({ title, description, icon: Icon, action, children }: PageShellProps) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="space-y-6 font-sans"
  >
    {/* Page header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm"
        >
          {action.label}
        </Button>
      )}
    </div>

    {/* Content */}
    {children}
  </motion.div>
);

export default PageShell;
