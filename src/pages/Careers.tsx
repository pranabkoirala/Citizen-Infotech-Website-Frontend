import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import GradientOrbs from "@/components/GradientOrbs";
import { whyUsReasons, hiringSteps } from "@/lib/data";
import { jobsApi, pagesApi, settingsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, TrendingUp, BookOpen, Coffee, DollarSign, RefreshCw, Heart, Send, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const icons = [TrendingUp, BookOpen, Coffee, DollarSign, RefreshCw, Heart];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Careers = () => {
  const { data: jobs = [], isLoading } = useQuery({ queryKey: ["jobs"], queryFn: jobsApi.getAll });
  const { data: whyUsPage } = useQuery({ queryKey: ["page", "why-us"], queryFn: () => pagesApi.get("why-us"), retry: false });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get, retry: false });
  const openJobs = jobs.filter((job) => job.status?.toLowerCase() === "open");
  const email = settings?.contact_email || "info@citizeninfotechnepal.com";

  return (
    <Layout>
    <section className="relative overflow-hidden section-padding !pt-28">
      <GradientOrbs />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="container-tight relative">
        <AnimatedSection>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
          >
            <Briefcase size={12} className="text-primary" />
            <span className="whitespace-nowrap text-xs font-medium text-primary">We're hiring</span>
          </motion.div>
          <h1 className="max-w-lg font-heading text-4xl font-bold text-foreground md:text-5xl">
            Build a career around work that <span className="gradient-text">matters.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Join a team that cares about the craft, the people we work with, and shipping software that holds up.
          </p>
        </AnimatedSection>

        {/* Open Roles */}
        <AnimatedSection className="mt-16">
          <div className="glass-card-hover glow-pulse rounded-xl p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase size={18} className="text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">Open roles</h2>
            </div>
            {isLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                Loading open roles...
              </div>
            ) : openJobs.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {openJobs.map((job) => (
                  <Link
                    key={job.id}
                    to="/contact"
                    className="group rounded-xl border border-border bg-background/50 p-5 transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                          {job.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          {job.location}
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Open
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No openings right now — but we're always interested in meeting great people. Drop us a line at{" "}
                <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>.
              </p>
            )}
          </div>
        </AnimatedSection>

        {/* Why Us */}
        <div className="mt-20">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Why us</p>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {whyUsPage?.content || "A team you can stand behind."}
            </h2>
          </AnimatedSection>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whyUsReasons.map((r, i) => {
              const Icon = icons[i] || Heart;
              return (
                <motion.div key={r.title} variants={item}>
                  <motion.div whileHover={{ y: -4 }} className="glass-card-hover group rounded-xl p-6 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{r.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                    <div className="mt-4 h-0.5 w-0 rounded bg-primary/30 transition-all duration-500 group-hover:w-full" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Hiring Process - Visual Timeline */}
        <div className="mt-20">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Hiring</p>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Our hiring process</h2>
            <p className="mt-2 text-muted-foreground">Everything you need to know about applying.</p>
          </AnimatedSection>

          <div className="relative mt-10">
            {/* Connecting line */}
            <div className="absolute left-6 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.05))" }} />
            <div className="space-y-8">
              {hiringSteps.map((step, i) => (
                <AnimatedSection key={step} delay={i * 0.12}>
                  <div className={`relative flex items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <span className="font-heading text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass-card-hover flex-1 rounded-xl px-5 py-4 md:w-[calc(50%-2rem)]"
                    >
                      <div className="flex items-center gap-2">
                        <Send size={14} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">{step}</span>
                      </div>
                    </motion.div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <AnimatedSection className="mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">Want to join us?</h2>
            <p className="mt-2 text-muted-foreground">We're always looking for thoughtful people who care about craft.</p>
            <Link to="/contact" className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/20">
              See open roles <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
    </Layout>
  );
};

export default Careers;
