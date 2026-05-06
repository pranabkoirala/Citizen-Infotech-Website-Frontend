import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import GradientOrbs from "@/components/GradientOrbs";
import { projects as fallbackProjects } from "@/lib/data";
import { projectsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

const Work = () => {
  const { data: liveProjects } = useQuery({ queryKey: ["projects"], queryFn: projectsApi.getAll, retry: false });
  const projects = liveProjects && liveProjects.length > 0 ? liveProjects : fallbackProjects;
  return (
  <Layout>
    <section className="relative overflow-hidden section-padding !pt-28">
      <GradientOrbs />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="container-tight relative">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 items-center rounded-full border border-primary/30 bg-primary/5 px-3">
              <span className="text-xs font-medium text-primary">{projects.length} projects</span>
            </div>
          </div>
          <h1 className="max-w-xl font-heading text-4xl font-bold text-foreground md:text-5xl">
            Software we've shipped across health, education and{" "}
            <span className="gradient-text">government.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Platforms, products and tools — engineered for organizations doing meaningful work, deployed in production, used every day.
          </p>
        </AnimatedSection>

        <div className="mt-4 flex items-center gap-6">
          <AnimatedSection delay={0.2}>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-primary">9+</span>
              <span className="text-xs text-muted-foreground">Production systems</span>
            </div>
          </AnimatedSection>
        </div>

        <div className="container-tight mt-6 px-0"><div className="line-glow" /></div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-12 grid gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              variants={item}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className="glass-card-hover group flex items-start gap-6 rounded-xl p-6 cursor-pointer"
            >
              <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
                <Code size={24} className="text-primary/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-xs font-bold text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{p.category}</span>
                  <span className="text-xs text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="mt-2 font-heading text-xl font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              </div>
              <ArrowUpRight size={18} className="mt-2 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection className="mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">Have a system to build?</h2>
            <p className="mt-2 text-muted-foreground">Tell us what you're working on — we'll get back within one business day.</p>
            <Link to="/contact" className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/20">
              Start a project <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </Layout>
  );
};

export default Work;
