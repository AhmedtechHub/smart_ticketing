import PageShell from "../Components/PageShell";
import { CopyPlus, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const TicketGalleryPage = () => {
    return (
        <PageShell
            title="Ticket Design Gallery"
            description="Peruse saved ticket design configurations and visual templates across the platform."
            icon={CopyPlus}
        >
            <div className="mt-6 border border-border bg-card rounded-2xl flex flex-col items-center justify-center p-16 shadow-sm overflow-hidden relative">
                
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
                    <div className="h-20 w-20 rounded-2xl bg-muted/50 border border-border border-dashed flex items-center justify-center mb-6 shadow-sm">
                        <CopyPlus className="w-10 h-10 text-muted-foreground opacity-50" />
                    </div>
                    
                    <h3 className="text-2xl font-black tracking-tight text-foreground mb-3">
                        Visual Configurations
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8">
                        The fully customizable advanced visual ticket builder and styling gallery module is slated for the upcoming Phase 2 production release cycle. Currently, system-level generated tickets handle all dynamic allocations flawlessly.
                    </p>
                    
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-11 rounded-xl bg-muted/30 border-border gap-2 font-bold px-6">
                            <Clock className="w-4 h-4 text-muted-foreground" /> Dev Roadmap
                        </Button>
                        <Button className="h-11 rounded-xl gap-2 font-bold px-6 shadow-lg shadow-primary/20">
                            <CalendarDays className="w-4 h-4" /> Next Milestone
                        </Button>
                    </div>
                </div>

            </div>
        </PageShell>
    );
};

export default TicketGalleryPage;
