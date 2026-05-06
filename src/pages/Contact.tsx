import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { messagesApi } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message too long"),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(form, "hello");
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    setSubmitting(true);
    try {
      await messagesApi.submit(parsed.data as { name: string; email: string; message: string });
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="section-padding !pt-28">
        <div className="container-tight">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Contact</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">Get in touch</h1>
            <p className="mt-4 max-w-lg text-muted-foreground">Have a project in mind? Let's talk about what you're building.</p>
          </AnimatedSection>

          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <AnimatedSection>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" placeholder="Your name" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <input
                  type="email" placeholder="Email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <textarea
                  placeholder="Tell us about your project..." rows={5} required value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {submitting ? (<><Loader2 size={16} className="animate-spin" /> Sending...</>) : (<>Send message <Send size={16} /></>)}
                </button>
              </form>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href="mailto:info@citizeninfotechnepal.com" className="text-sm text-muted-foreground hover:text-primary">info@citizeninfotechnepal.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <a href="tel:+9779768770259" className="text-sm text-muted-foreground hover:text-primary">+977-9768770259</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground">Pashupati Colony, Mid Baneshwor, Kathmandu, Ward 01, Nepal</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
