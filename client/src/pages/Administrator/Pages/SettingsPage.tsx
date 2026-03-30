import PageShell from "../Components/PageShell";
import { Settings } from "lucide-react";

const SettingsPage = () => (
    <PageShell
        title="Settings"
        description="Configure system preferences and global parameters."
        icon={Settings}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
               <h3 className="font-semibold text-lg border-b border-border pb-2">Public Branding</h3>
               <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Logo, color themes, site metadata.</p>
                  <button className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg text-sm">Update Logo</button>
               </div>
            </div>
             <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
               <h3 className="font-semibold text-lg border-b border-border pb-2">Global Commission</h3>
               <div className="space-y-4 flex flex-col">
                  <p className="text-sm text-muted-foreground">Default processing fee: <span className="text-primary font-bold">4.5%</span></p>
                  <p className="text-sm text-muted-foreground italic">Update commission levels for your planners and attendees here.</p>
               </div>
            </div>
        </div>
    </PageShell>
);

export default SettingsPage;
