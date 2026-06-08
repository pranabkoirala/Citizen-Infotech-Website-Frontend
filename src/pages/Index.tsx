import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Code,
  Globe,
  Cpu,
  Palette,
  Cloud,
  HeartPulse,
  Quote,
} from "lucide-react";

import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import FloatingParticles from "@/components/FloatingParticles";
import GradientOrbs from "@/components/GradientOrbs";
import Marquee from "@/components/Marquee";

import {
  services as fallbackServices,
  stats,
  projects as fallbackProjects,
  testimonials,
  trustedBy,
  processSteps,
} from "@/lib/data";

import {
  settingsApi,
  projectsApi,
  servicesApi,
  mediaUrl,
} from "@/lib/api";
import { projectHref } from "@/lib/projectLinks";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const serviceIcons = [
  HeartPulse,
  Globe,
  Code,
  Cpu,
  Palette,
  Cloud,
];

const Home = () => {
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const { data: liveProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const { data: liveServices } = useQuery({
    queryKey: ["services"],
    queryFn: servicesApi.getAll,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const s = settings || {};

  const projectsList =
    liveProjects && liveProjects.length > 0
      ? liveProjects.filter((p) => p.visible_on_home !== false)
      : fallbackProjects;

  const servicesList =
    liveServices && liveServices.length > 0
      ? liveServices
        .filter((sv) => sv.show_on_home !== false)
        .sort(
          (a, b) =>
            (a.order_index ?? 0) - (b.order_index ?? 0)
        )
      : fallbackServices.map((sv, i) => ({
        id: i,
        title: sv.title,
        description: sv.description,
      }));

  const savedTestimonials =
    s.testimonials?.filter(
      (t) => t.name?.trim() && t.text?.trim()
    ) || [];

  const savedTrustedCompanies =
    s.trusted_companies?.filter((company) =>
      company.name?.trim()
    ) || [];

  const testimonialsList = s.testimonials
    ? savedTestimonials
    : testimonials;

  const trustedCompanies = s.trusted_companies
    ? savedTrustedCompanies
    : trustedBy;

  const toggleService = (id: string) => {
    setExpandedServices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden section-padding !pb-10 !pt-28 lg:!pb-12 lg:!pt-36">
        <GradientOrbs />
        <FloatingParticles count={40} />

        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="container-tight relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{
                duration: 0.6,
                delay: 0.3,
              }}
              className="mb-6 inline-flex pr-7 md:pr-4 gap-2 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
            >
              <span className="relative flex h-2 w-2 mt-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>

              <span className="text-xs font-medium text-primary">
                {s.hero_eyebrow ||
                  "Citizen Infotech · Software Studio"}
              </span>
            </motion.div>

            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                }}
                className="block"
              >
                {s.hero_title_line1 ||
                  "Engineering software"}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.6,
                }}
                className="block"
              >
                {s.hero_title_line2 ||
                  "that moves ambitious"}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.6,
                }}
                className="block"
              >
                {(() => {
                  const line =
                    s.hero_title_line3 ||
                    "businesses forward.";

                  const parts = line.trim().split(/\s+/);

                  const last = parts.pop() || "";

                  return (
                    <>
                      {parts.join(" ")}{" "}
                      <span className="gradient-text">
                        {last}
                      </span>
                    </>
                  );
                })()}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.7,
                duration: 0.6,
              }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {s.hero_description ||
                "Citizen Infotech provides innovative, scalable solutions to drive business growth and efficiency."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.9,
                duration: 0.5,
              }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                {s.hero_cta_primary || "Start a project"}

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              {/* <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                {s.hero_cta_secondary || "See our work"}
              </Link> */}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container-tight px-6">
        <div className="line-glow" />
      </div>

      {/* Stats */}
      <section className="section-padding !py-10 md:!py-12">
        <div className="container-tight">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <AnimatedCounter
                key={s.label}
                value={s.value}
                label={s.label}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Services */}
      <section className="relative section-padding !py-16 overflow-hidden lg:!py-20">
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="container-tight relative">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              {s.services_eyebrow || "What we do"}
            </p>

            <h2 className="mt-3 max-w-lg font-heading text-3xl font-bold text-foreground md:text-4xl">
              {s.services_title ||
                "Services built around outcomes, not checklists."}
            </h2>

            <p className="mt-4 max-w-xl text-muted-foreground">
              {s.services_description ||
                "From early-stage product strategy to long-running platform engineering."}
            </p>
          </AnimatedSection>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {servicesList.map((sv, i) => {
              const Icon =
                serviceIcons[i % serviceIcons.length] || Code;

              const serviceId = String(sv.id ?? i);

              return (
                <motion.div
                  key={sv.id ?? i}
                  whileHover={{
                    y: -6,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className="
              glass-card-hover
              group
              rounded-xl
              p-6
              cursor-pointer
              h-full
            "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                  flex h-10 w-10 items-center justify-center rounded-lg
                  bg-primary/10
                  transition-all duration-300
                  group-hover:bg-primary/20
                  group-hover:scale-110
                "
                    >
                      <Icon
                        size={18}
                        className="
                    text-primary
                    transition-transform duration-300
                    group-hover:rotate-6
                  "
                      />
                    </div>

                    <span
                      className="
                  text-xs font-bold text-primary/60
                  transition-colors duration-300
                  group-hover:text-primary
                "
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    className="
                mt-4 font-heading text-lg font-semibold text-foreground
                transition-colors duration-300
                group-hover:text-primary
              "
                  >
                    {sv.title}
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${expandedServices[serviceId]
                      ? ""
                      : "line-clamp-2"
                      }`}
                  >
                    {sv.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleService(serviceId)}
                    className="
                mt-3 inline-flex items-center gap-1
                text-xs font-medium text-primary
                transition-all duration-300
                hover:underline
              "
                  >
                    {expandedServices[serviceId]
                      ? "Read less"
                      : "Read more"}

                    <ArrowRight
                      size={12}
                      className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
                    />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>



      {/* Services
      <section className="relative section-padding !py-16 overflow-hidden lg:!py-20">
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="container-tight relative">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              {s.services_eyebrow || "What we do"}
            </p>

            <h2 className="mt-3 max-w-lg font-heading text-3xl font-bold text-foreground md:text-4xl">
              {s.services_title ||
                "Services built around outcomes, not checklists."}
            </h2>

            <p className="mt-4 max-w-xl text-muted-foreground">
              {s.services_description ||
                "From early-stage product strategy to long-running platform engineering."}
            </p>
          </AnimatedSection>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {servicesList.map((sv, i) => {
              const Icon =
                serviceIcons[i % serviceIcons.length] || Code;
              const serviceId = String(sv.id ?? i);

              return (
                <div
                  key={sv.id ?? i}
                  className="glass-card-hover group rounded-xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon size={18} className="text-primary" />
                    </div>

                    <span className="text-xs font-bold text-primary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {sv.title}
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${expandedServices[serviceId] ? "" : "line-clamp-2"
                      }`}
                  >
                    {sv.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleService(serviceId)}
                    className="mt-3 text-xs font-medium text-primary hover:underline"
                  >
                    {expandedServices[serviceId] ? "Read less" : "Read more"}
                  </button>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section> */}



      {/* Selected Work */}
      <section className="section-padding !py-16 lg:!py-20">
        <div className="container-tight">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              {s.work_eyebrow || "Selected work"}
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {s.work_title || "Projects we've shipped."}
            </h2>
          </AnimatedSection>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsList.slice(0, 6).map((p, i) => (
              <AnimatedSection
                key={p.id}
                delay={i * 0.08}
              >
                <Link
                  to={projectHref(p)}
                  className="block h-full"
                  aria-label={`Open ${p.title} project details`}
                >
                  <motion.div
                    whileHover={{
                      y: -6,
                      transition: {
                        duration: 0.25,
                      },
                    }}
                    className="glass-card-hover group h-full cursor-pointer rounded-xl p-6"
                  >
                    <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-secondary to-primary/5">
                      {p.image_url ? (
                        <img
                          src={mediaUrl(p.image_url)}
                          alt={p.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Code
                          size={32}
                          className="text-primary/30"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {p.category}
                      </span>

                      <ArrowUpRight
                        size={14}
                        className="text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      />
                    </div>

                    <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                      {p.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              All projects

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials
      {testimonialsList.length > 0 && (
        <section className="relative section-padding !py-16 overflow-hidden lg:!py-20">
          <div className="absolute inset-0 grid-bg opacity-20" />

          <div className="container-tight relative">
            <AnimatedSection>
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Client testimonials
              </p>

              <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-foreground md:text-4xl">
                What partners say after shipping with Citizen Infotech.
              </h2>
            </AnimatedSection>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-8 grid gap-4 md:grid-cols-3"
            >
              {testimonialsList.slice(0, 3).map((testimonial, i) => (
                <motion.article
                  key={`${testimonial.name}-${i}`}
                  variants={item}
                  className="glass-card-hover flex h-full flex-col rounded-xl p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Quote size={18} className="text-primary" />
                  </div>

                  <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {testimonial.name}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )} */}

      {/* Testimonials */}
      {testimonialsList.length > 0 && (
        <section className="relative section-padding !py-16 overflow-hidden lg:!py-20">
          <div className="absolute inset-0 grid-bg opacity-20" />

          <div className="container-tight relative">
            <AnimatedSection>
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Client testimonials
              </p>

              <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-foreground md:text-4xl">
                What partners say after shipping with Citizen Infotech.
              </h2>
            </AnimatedSection>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-8 grid gap-4 md:grid-cols-3"
            >
              {testimonialsList.slice(0, 3).map((testimonial, i) => (
                <motion.article
                  key={`${testimonial.name}-${i}`}
                  variants={item}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25 },
                  }}
                  className="
              glass-card-hover
              group
              flex h-full flex-col
              rounded-xl p-6
              transition-all duration-300
              hover:shadow-2xl
              hover:border-primary/30
              cursor-pointer
            "
                >
                  <div
                    className="
                flex h-10 w-10 items-center justify-center rounded-lg
                bg-primary/10
                transition-all duration-300
                group-hover:bg-primary/20
                group-hover:scale-110
              "
                  >
                    <Quote
                      size={18}
                      className="
                  text-primary
                  transition-transform duration-300
                  group-hover:rotate-6
                "
                    />
                  </div>

                  <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/90">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {testimonial.name}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Trusted By */}
      {trustedCompanies.length > 0 && (
        <section className="section-padding !py-10 md:!py-12">
          <div className="container-tight">
            <AnimatedSection>
              <div className="flex flex-col gap-6 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm md:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-primary">
                      Trusted by companies
                    </p>

                    <h2 className="mt-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
                      Teams and institutions that count on our systems.
                    </h2>
                  </div>
                </div>

                <Marquee items={trustedCompanies} />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Home;
