import PageShell from "../Components/PageShell";
import type { LucideIcon } from "lucide-react";
import { HelpCircle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => (
    <PageShell
        title={title}
        description={description || "This module is coming soon and will feature a comprehensive interface."}
        icon={icon || HelpCircle}
    >
        <div className="rounded-2xl border border-border border-dashed bg-card p-24 flex items-center justify-center text-center">
            <div>
                 <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                 <h3 className="text-lg font-semibold text-muted-foreground">Module under development</h3>
                 <p className="text-sm text-muted-foreground opacity-70">A comprehensive analytics and toolset will be available in the next release.</p>
            </div>
        </div>
    </PageShell>
);

export default PlaceholderPage;
