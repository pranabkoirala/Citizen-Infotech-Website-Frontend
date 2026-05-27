import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Code, Globe, Cpu, Palette, Cloud, HeartPulse } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import FloatingParticles from "@/components/FloatingParticles";
import GradientOrbs from "@/components/GradientOrbs";
import Marquee from "@/components/Marquee";
import { services as fallbackServices, stats, projects as fallbackProjects, testimonials, trustedBy, processSteps } from "@/lib/data";
import { settingsApi, projectsApi, servicesApi } from "@/lib/api";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const serviceIcons = [HeartPulse, Globe, Code, Cpu, Palette, Cloud];

const Home = () => {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get, retry: false });
  const { data: liveProjects } = useQuery({ queryKey: ["projects"], queryFn: projectsApi.getAll, retry: false });
  const { data: liveServices } = useQuery({ queryKey: ["services"], queryFn: servicesApi.getAll, retry: false });

  const s = settings || {};
  const projectsList = (liveProjects && liveProjects.length > 0)
    ? liveProjects.filter((p) => p.visible_on_home !== false)
    : fallbackProjects;
  const servicesList = (liveServices && liveServices.length > 0)
    ? liveServices.filter((sv) => sv.show_on_home !== false).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    : fallbackServices.map((sv, i) => ({ id: i, title: sv.title, description: sv.description }));
  const savedTestimonials = s.testimonials?.filter((t) => t.name?.trim() && t.text?.trim()) || [];
  const savedTrustedCompanies = s.trusted_companies?.filter((company) => company.name?.trim()) || [];
  const testimonialsList = s.testimonials ? savedTestimonials : testimonials;
  const trustedCompanies = s.trusted_companies ? savedTrustedCompanies : trustedBy;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden section-padding !pb-12 !pt-28 lg:!pt-40">
        <GradientOrbs />
        <FloatingParticles count={40} />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container-tight relative">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 inline-flex pr-7 md:pr-4 gap-2 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
            >
              <span className="relative flex h-2 w-2 mt-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className=" text-xs font-medium text-primary">{s.hero_eyebrow || "Citizen Infotech · Software Studio"}</span>
            </motion.div>

            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="block">
                {s.hero_title_line1 || "Engineering software"}
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="block">
                {s.hero_title_line2 || "that moves ambitious"}
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="block">
                {(() => {
                  const line = s.hero_title_line3 || "businesses forward.";
                  const parts = line.trim().split(/\s+/);
                  const last = parts.pop() || "";
                  return (<>{parts.join(" ")} <span className="gradient-text">{last}</span></>);
                })()}
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {s.hero_description || "Citizen Infotech provides innovative, scalable solutions to drive business growth and efficiency. Our expert team ensures your business remains competitive with tailored IT services."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/contact" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {s.hero_cta_primary || "Start a project"} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/work" className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5">
                {s.hero_cta_secondary || "See our work"}
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Line separator */}
      <div className="container-tight px-6"><div className="line-glow" /></div>

      {/* Stats */}
      <section className="section-padding !py-16">
        <div className="container-tight">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <AnimatedCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container-tight relative">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">{s.services_eyebrow || "What we do"}</p>
            <h2 className="mt-3 max-w-lg font-heading text-3xl font-bold text-foreground md:text-4xl">
              {s.services_title || "Services built around outcomes, not checklists."}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              {s.services_description || "From early-stage product strategy to long-running platform engineering — we plug into your team and ship work you can stand behind."}
            </p>
          </AnimatedSection>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((sv, i) => {
              const Icon = serviceIcons[i % serviceIcons.length] || Code;
              return (
                <motion.div key={sv.id ?? i} variants={item} className="glass-card-hover group rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/60">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{sv.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sv.description}</p>
                  <div className="mt-4 h-0.5 w-0 rounded bg-primary/30 transition-all duration-500 group-hover:w-full" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="section-padding">
        <div className="container-tight">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">{s.work_eyebrow || "Selected work"}</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {s.work_title || "Projects we've shipped."}
            </h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsList.slice(0, 6).map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="glass-card-hover group cursor-pointer rounded-xl p-6"
                >
                  <div className="mb-3 h-32 rounded-lg bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                    <Code size={32} className="text-primary/30" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{p.category}</span>
                    <ArrowUpRight size={14} className="text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/work" className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5">
              All projects <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container-tight relative">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">How we work</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">A four-step process, repeatable across teams.</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">Tight feedback loops, transparent tracking, and senior craft from kickoff to launch.</p>
          </AnimatedSection>
          <div className="relative mt-12">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.05))" }} />
            <div className="grid gap-8 lg:grid-cols-4">
              {processSteps.map((s, i) => (
                <AnimatedSection key={s.step} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className="glass-card-hover relative rounded-xl p-6"
                  >
                    <div className="absolute -top-3 left-6 flex h-6 items-center rounded-full bg-primary px-3">
                      <span className="text-[10px] font-bold text-primary-foreground">{s.step}</span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-tight">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Kind words</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">What clients say after we ship.</h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonialsList.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-card-hover relative flex flex-col rounded-xl p-6"
                >
                  <div className="absolute -top-3 left-6 font-heading text-4xl font-bold text-primary/20">"</div>
                  <p className="mt-4 flex-1 text-sm italic leading-relaxed text-muted-foreground">{t.text}</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by - Marquee */}
      <section className="section-padding !py-12">
        <div className="container-tight">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Trusted by teams who care about the details</p>
          <Marquee items={trustedCompanies} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding !py-20">
        <div className="container-tight">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-10 md:p-16 text-center">
              <FloatingParticles count={15} />
              <div className="relative">
                <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{s.cta_title || "Ready to build something great?"}</h2>
                <p className="mt-3 text-muted-foreground">{s.cta_description || "Let's turn your idea into production-ready software."}</p>
                <Link to="/contact" className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20">
                  Start a project <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
