import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import GradientOrbs from "@/components/GradientOrbs";
import { pagesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Handshake, Shield } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { title: "Clarity first", desc: "We start with the problem, not the tech. Every engagement begins with a tight discovery so we build the right thing.", icon: Eye },
  { title: "True partnership", desc: "Senior engineers, weekly demos, shared dashboards. You always know where the work stands and where it's heading next.", icon: Handshake },
  { title: "Built to last", desc: "Tested code, modern stacks, documented systems. We hand off projects you can extend with confidence.", icon: Shield },
];

const milestones = [
  { year: "2012", text: "Founded in Kathmandu with a focus on IT consulting" },
  { year: "2016", text: "Expanded into healthcare technology solutions" },
  { year: "2020", text: "Launched AI-powered CDSS and EHR/EMR systems" },
  { year: "2024", text: "Serving 80+ clients across multiple sectors" },
];

const About = () => {
  const { data: aboutPage } = useQuery({ queryKey: ["page", "about"], queryFn: () => pagesApi.get("about"), retry: false });

  return (
    <Layout>
    <section className="relative overflow-hidden section-padding !pt-28">
      <GradientOrbs />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="container-tight relative">
        <AnimatedSection>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-widest text-primary"
          >About us</motion.p>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl font-bold text-foreground md:text-5xl">
            A team of builders, helping ambitious teams ship{" "}
            <span className="gradient-text">better software.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {aboutPage?.content || "Citizen Infotech provides innovative, scalable solutions to drive business growth and efficiency."}
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* Story */}
    <section className="section-padding !py-12">
      <div className="container-tight">
        <AnimatedSection>
          <div className="glass-card-hover rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Our story</p>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Software, shipped with intent.</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>CITIZEN INFOTECH PVT. LTD. is a process-driven provider of customized software, web, and AI solutions. Since 2012, we have delivered quality IT services, including website design and development, software development, IT consultancy, Android/iOS app development, and the supply of computers, CCTV cameras, and digital boards.</p>
              <p>Citizen Infotech specializes in cutting-edge healthcare technology solutions, with a focus on EHR and CDSS which utilize AI models for disease predictions, differential diagnosis, and other advanced features. Our products also include E-HMIS, which automates health recording and reporting across all health facilities nationwide.</p>
              <p>With these innovative solutions, Citizen Infotech is uniquely positioned to support both public and private sectors in enhancing their services through automation, AI, and efficient data management.</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-padding !py-12">
      <div className="container-tight">
        <AnimatedSection>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Journey</p>
          <h2 className="mt-3 font-heading text-2xl font-bold text-foreground">Key milestones</h2>
        </AnimatedSection>
        <div className="relative mt-10 ml-4">
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary/50 to-transparent" />
          {milestones.map((m, i) => (
            <AnimatedSection key={m.year} delay={i * 0.12}>
              <div className="relative mb-8 pl-8">
                <div className="absolute left-0 top-1 -translate-x-1/2">
                  <div className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
                </div>
                <span className="text-xs font-bold text-primary">{m.year}</span>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding !py-12">
      <div className="container-tight grid gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.1}>
            <motion.div whileHover={{ y: -4 }} className="glass-card-hover rounded-xl p-6 h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <v.icon size={18} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </section>

    {/* CTA */}
    <AnimatedSection className="section-padding !py-16">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Have a project in mind?</h2>
          <p className="mt-2 text-muted-foreground">Let's talk about what you're building and how we can help ship it.</p>
          <Link to="/contact" className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/20">
            Get in touch <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
    </Layout>
  );
};

export default About;
