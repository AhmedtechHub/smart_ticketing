import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { 
  Ticket, 
  Download, 
  Printer, 
  QrCode, 
  MapPin, 
  Calendar, 
  User,
  Settings2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TicketGeneratorPage = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    
    // Form State
    const [selectedEventId, setSelectedEventId] = useState("");
    const [selectedTicketId, setSelectedTicketId] = useState("");
    const [attendeeName, setAttendeeName] = useState("John Doe");
    const [attendeeEmail, setAttendeeEmail] = useState("john@example.com");

    const { toast } = useToast();
    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsData, ticketsData] = await Promise.all([
                adminApi.getEvents(),
                adminApi.getAllTickets()
            ]);
            setEvents(eventsData.filter((e: any) => e.status !== 'ARCHIVED'));
            setTickets(ticketsData);
        } catch (err) {
            console.error(err);
        }
    };

    const activeEvent = events.find(e => e.id === selectedEventId);
    const activeTicket = tickets.find(t => t.id === selectedTicketId);

    const availableTiers = tickets.filter(t => t.eventId === selectedEventId);

    const [isIssuing, setIsIssuing] = useState(false);

    const handlePrint = async () => {
        if (!activeEvent || !activeTicket) {
            return toast({
                variant: "destructive",
                title: "Incomplete Generation",
                description: "Select an Event and Ticket Category to print.",
            });
        }

        if (ticketRef.current && !isIssuing) {
            setIsIssuing(true);
            try {
                const base64Image = await htmlToImage.toPng(ticketRef.current, { pixelRatio: 2 });

                await adminApi.issueTicket({
                    eventId: selectedEventId,
                    ticketId: selectedTicketId,
                    attendeeName,
                    attendeeEmail,
                    image: base64Image
                });

                toast({
                    title: "Ticket Issued Successfully!",
                    description: "Inventory deducted and email dispatched to attendee.",
                });

                window.print();
            } catch (err: any) {
                console.error("Failed to process ticket:", err);
                toast({
                    variant: "destructive",
                    title: "Processing Failed",
                    description: err.response?.data?.error || "Could not issue ticket properly. Try again.",
                });
            } finally {
                setIsIssuing(false);
            }
        }
    };

    // QR payload can be a verifiable dummy link or unique payload JSON
    const qrPayload = JSON.stringify({
        event: selectedEventId,
        tier: selectedTicketId,
        email: attendeeEmail,
        ref: "SYS-GEN-2026-" + Math.floor(Math.random() * 90000)
    });

    return (
        <PageShell
            title="Ticket Generator Lab"
            description="Manually issue, generate and export sleek verifiable physical tickets."
            icon={ImageIcon}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 print:block print:m-0">
                
                {/* Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 print:hidden">
                        <div className="flex items-center gap-2 mb-6 text-foreground">
                            <Settings2 className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">Configuration</h3>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target Event</Label>
                                <Select value={selectedEventId} onValueChange={(val) => { setSelectedEventId(val); setSelectedTicketId(""); }}>
                                    <SelectTrigger className="w-full h-11 bg-muted/20 border-border rounded-xl">
                                        <SelectValue placeholder="Select an Event..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map(ev => (
                                            <SelectItem key={ev.id} value={ev.id}>{ev.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ticket Category / Tier</Label>
                                <Select value={selectedTicketId} onValueChange={setSelectedTicketId} disabled={!selectedEventId}>
                                    <SelectTrigger className="w-full h-11 bg-muted/20 border-border rounded-xl">
                                        <SelectValue placeholder="Select Tier Class..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTiers.map(t => (
                                            <SelectItem key={t.id} value={t.id}>
                                                <div className="flex justify-between w-full pr-4 gap-4 items-center">
                                                    <span>{t.type}</span>
                                                    <span className="font-bold text-primary">KES {t.price}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                        {availableTiers.length === 0 && (
                                            <div className="p-2 px-4 text-xs text-muted-foreground">No tiers defined for this event.</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attendee Name</Label>
                                <Input 
                                    className="h-11 bg-muted/20 border-border rounded-xl"
                                    value={attendeeName}
                                    onChange={(e) => setAttendeeName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attendee Email</Label>
                                <Input 
                                    type="email"
                                    className="h-11 bg-muted/20 border-border rounded-xl"
                                    value={attendeeEmail}
                                    onChange={(e) => setAttendeeEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                             <Button onClick={handlePrint} disabled={isIssuing} variant="outline" className="h-12 w-full rounded-xl gap-2 font-bold hover:bg-muted/50 border-border">
                                 <Printer className="w-4 h-4 text-primary" /> {isIssuing ? "Processing..." : "Print"}
                             </Button>
                             <Button onClick={handlePrint} disabled={isIssuing} className="h-12 w-full rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                                 <Download className="w-4 h-4" /> {isIssuing ? "Processing..." : "Export image"}
                             </Button>
                        </div>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="lg:col-span-8 print:w-full print:m-0 print:p-0">
                    <div className="bg-card/40 rounded-3xl border border-dashed border-border/60 p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden backdrop-blur-sm print:border-none print:p-0 print:bg-transparent">
                        
                        {!activeEvent || !activeTicket ? (
                            <div className="text-center space-y-4 opacity-50 print:hidden">
                                <QrCode className="w-16 h-16 mx-auto text-muted-foreground opacity-30" />
                                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                    Awaiting Configuration...
                                </p>
                            </div>
                        ) : (
                            // Sleek Ticket Design Frame
                            <div ref={ticketRef} className="w-full max-w-[700px] flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-background border border-border relative print:shadow-none print:max-w-none print:border-none">
                                
                                {/* Left Decorator / Artwork */}
                                <div className="w-full md:w-[35%] bg-zinc-950 p-6 flex flex-col justify-between relative overflow-hidden text-white border-r border-border/10 border-dashed">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-md mb-6 border border-primary/30">
                                                <Ticket className="w-5 h-5 text-primary" />
                                            </div>
                                            <h2 className="text-3xl font-black leading-tight mb-2 uppercase break-words">{activeEvent.title}</h2>
                                            <p className="text-xs text-zinc-400 font-medium line-clamp-2">{activeEvent.description}</p>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Date & Time</p>
                                                    <p className="text-sm font-semibold">{format(new Date(activeEvent.date), "PPP")}</p>
                                                    <p className="text-xs text-primary font-bold">{format(new Date(activeEvent.date), "p")}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Venue</p>
                                                    <p className="text-sm font-semibold truncate">{activeEvent.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Tear Notches */}
                                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/40 backdrop-blur-xl border border-border z-20 print:bg-transparent print:border-none"></div>
                                </div>

                                {/* Right Data / Verification */}
                                <div className="w-full md:w-[65%] bg-card p-6 flex flex-col justify-between relative">
                                    <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/40 backdrop-blur-xl border border-border z-20 print:bg-transparent print:border-none"></div>

                                    <div className="flex justify-between items-start mb-8 pl-0 md:pl-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Pass Category</p>
                                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-dashed ${
                                                activeTicket.type.includes('VIP') ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' : 'bg-primary/10 text-primary border-primary/30'
                                            }`}>
                                                {activeTicket.type}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Admit</p>
                                            <p className="text-2xl font-black font-mono tracking-tighter text-foreground">1</p>
                                        </div>
                                    </div>

                                    <div className="pl-0 md:pl-6 flex items-end justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Attendee / Bearer</p>
                                                <p className="text-lg font-bold text-foreground flex items-center gap-2 truncate whitespace-nowrap overflow-hidden">
                                                    <User className="w-4 h-4 text-primary shrink-0" /> {attendeeName}
                                                </p>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-border/50 border-dashed">
                                                <div className="flex justify-between items-center opacity-40">
                                                    {/* Fake Barcode */}
                                                    <div className="flex gap-0.5 flex-1 mx-2 h-6">
                                                        {[...Array(40)].map((_, i) => (
                                                            <div key={i} className="bg-foreground h-full" style={{ width: Math.random() * 4 + 1 + 'px' }}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-center mt-2 text-muted-foreground">
                                                    TKT-{activeTicket.id.split('').reverse().join('').slice(0, 12).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* QR Verifier */}
                                        <div className="shrink-0 bg-white p-2 rounded-xl border border-border shadow-sm">
                                            <QRCode 
                                                value={qrPayload}
                                                size={100}
                                                level="H"
                                                fgColor="#000000"
                                                bgColor="#ffffff"
                                            />
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-center mt-1 text-zinc-500">Scan to Verify</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </PageShell>
    );
};

export default TicketGeneratorPage;
