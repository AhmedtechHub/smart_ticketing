import { useState, useEffect } from "react";
import PageShell from "../Components/PageShell";
import { CopyPlus, Clock, CalendarDays, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/api/adminApi";
import { API_BASE_URL } from "@/api/apiConfig";

const TicketGalleryPage = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const payments = await adminApi.getPayments();
                const printedTickets = payments.filter((p: any) => p.qrCode);
                setTickets(printedTickets);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

    return (
        <PageShell
            title="Ticket Design Gallery"
            description="Peruse saved ticket design configurations and visual templates across the platform."
            icon={CopyPlus}
        >
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : tickets.length === 0 ? (
                <div className="mt-6 border border-border bg-card rounded-2xl flex flex-col items-center justify-center p-16 shadow-sm overflow-hidden relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
                        <div className="h-20 w-20 rounded-2xl bg-muted/50 border border-border border-dashed flex items-center justify-center mb-6 shadow-sm">
                            <CopyPlus className="w-10 h-10 text-muted-foreground opacity-50" />
                        </div>
                        
                        <h3 className="text-2xl font-black tracking-tight text-foreground mb-3">
                            Visual Configurations
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8">
                            The fully customizable advanced visual ticket builder and styling gallery module is slated for the upcoming Phase 2 production release cycle. Currently, system-level generated tickets handle all dynamic allocations flawlessly. When you print a ticket, it will appear here.
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
            ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((t, idx) => (
                        <div key={idx} className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-lg transition-all">
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center mb-4 border border-border p-2">
                                {t.qrCode ? (
                                    <img src={`${API_BASE_URL}${t.qrCode}`} alt="Generated Ticket" className="w-full h-full object-contain rounded-lg" />
                                ) : (
                                    <Ticket className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="px-2">
                                <h4 className="font-bold text-lg mb-1 truncate text-foreground">{t.event?.title || 'Unknown Event'}</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="truncate"><span className="font-semibold text-foreground">Attendee:</span> {t.attendee?.name || t.attendee?.email}</p>
                                    <p className="truncate"><span className="font-semibold text-foreground">Ref:</span> <span className="font-mono text-xs">{t.reference}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageShell>
    );
};

export default TicketGalleryPage;
