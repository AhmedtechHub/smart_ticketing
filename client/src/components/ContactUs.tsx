import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailOpen, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    eventDate: "",
    estimatedAttendance: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessPopup(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/attendee/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          eventType: "",
          eventDate: "",
          estimatedAttendance: "",
          message: ""
        });
        setSuccessPopup(true);
        setTimeout(() => setSuccessPopup(false), 4000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to send quote inquiry.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32 font-sans" id="contact">
      {/* Background dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      {/* Success Popup */}
      <AnimatePresence>
        {successPopup && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-10 left-1/2 flex items-center gap-3 rounded-2xl bg-card/80 backdrop-blur-xl border border-border px-6 py-4 shadow-2xl z-50 text-foreground"
          >
            <CheckCircle2 className="text-primary h-6 w-6" />
            <span className="font-semibold text-lg">Inquiry sent successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-bold uppercase tracking-widest text-primary"
          >
            <MailOpen className="h-5 w-5" />
            Post Your Event
          </motion.div>
        </div>

        {/* Main Content Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-effect mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl lg:flex-row lg:items-stretch lg:gap-0"
        >
          {/* Left Side: Image & Text */}
          <div className="flex w-full flex-col justify-between p-10 lg:w-1/2 lg:p-14">
            <div>
              <h2 className="font-serif text-5xl font-normal leading-tight text-foreground lg:text-6xl mb-6">
                Got an event to <br />
                <span className="text-primary">host?</span>
              </h2>
              <p className="font-sans text-lg font-medium text-foreground max-w-sm mb-10">
                Let's discuss how we can bring your next big event to life. Fill out the quote request and our team will get back to you with pricing.
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mt-4 flex justify-center lg:justify-start"
            >
              <img
                src="https://res.cloudinary.com/fffb5ery/image/upload/v1784293744/20260324_1238_Image_Generation_remix_01kmfkaqbgef6syxf5vwd0j6pe_rngxe2_kqgx5u.png"
                alt="Contact Illustration"
                className="w-64 sm:w-80 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full flex-1 border-t border-border/50 bg-muted/10 dark:bg-black/20 p-10 backdrop-blur-md lg:border-t-0 lg:border-l lg:p-14">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full justify-center">
              
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="w-full space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">
                    Your name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border-border bg-background/20 dark:bg-white/5 px-5 text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-sans glass-effect"
                  />
                </div>
                <div className="w-full space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">
                    Your email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border-border bg-background/20 dark:bg-white/5 px-5 text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-sans glass-effect"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="w-full space-y-1.5">
                  <label htmlFor="eventType" className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">
                    Event Type
                  </label>
                  <Input
                    type="text"
                    id="eventType"
                    name="eventType"
                    placeholder="e.g. Concert, Workshop"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border-border bg-background/20 dark:bg-white/5 px-5 text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-sans glass-effect"
                  />
                </div>
                <div className="w-full space-y-1.5">
                  <label htmlFor="eventDate" className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">
                    Preferred Date
                  </label>
                  <Input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border-border bg-background/20 dark:bg-white/5 px-5 text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-sans glass-effect"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="estimatedAttendance" className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">
                  Estimated Attendance
                </label>
                <Input
                  type="number"
                  id="estimatedAttendance"
                  name="estimatedAttendance"
                  placeholder="e.g. 500"
                  value={formData.estimatedAttendance}
                  onChange={handleChange}
                  required
                  className="h-12 rounded-xl border-border bg-background/20 dark:bg-white/5 px-5 text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-sans glass-effect"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">
                  Additional Details
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us more about your event goals..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-border bg-background/20 dark:bg-white/5 p-5 text-sm placeholder:text-muted-foreground/50 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-sans leading-relaxed resize-none glass-effect"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-14 w-full gap-3 rounded-2xl text-[14px] font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-primary/40 uppercase tracking-wide"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Inquiry...
                  </>
                ) : (
                  <>
                    Request Quote
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
