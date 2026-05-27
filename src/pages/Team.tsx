import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingParticles from "@/components/FloatingParticles";
import { teamMembers as fallback } from "@/lib/data";
import { mediaUrl, teamApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = {
  hidden: { opacity: 0, scale: 0.85, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const colors = [
  "from-blue-500/20 to-cyan-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-emerald-500/20 to-teal-500/20",
  "from-orange-500/20 to-amber-500/20",
  "from-rose-500/20 to-red-500/20",
];

const Team = () => {
  const { data } = useQuery({
    queryKey: ["team"],
    queryFn: teamApi.getAll,
    retry: 0,
  });
  // Use API data when available, fall back to static list when backend is unreachable
  const members = data && data.length > 0 ? data : fallback;

  return (
    <Layout>
      <section className="relative overflow-hidden section-padding !pt-28">
        <FloatingParticles count={20} />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container-tight relative">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-primary">{members.length} members</span>
            </div>
            <h1 className="max-w-lg font-heading text-4xl font-bold text-foreground md:text-5xl">
              The people behind every line of <span className="gradient-text">code.</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Engineers, designers, and strategists who care about the work — and the people we do it with.
            </p>
          </AnimatedSection>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {members.map((m, i) => {
              const imageSrc = m.image_url ? mediaUrl(m.image_url) : m.img;
              return (
                <motion.div
                  key={m.id}
                  variants={item}
                  whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2 } }}
                  className="glass-card-hover group rounded-xl p-4 text-center cursor-pointer"
                >
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${colors[i % colors.length]} overflow-hidden`}>
                    {imageSrc ? (
                      <img src={imageSrc} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <User size={22} className="text-foreground/60" />
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground leading-tight">{m.name}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">{m.role}</p>
                  <div className="mt-3 h-0.5 w-0 mx-auto rounded bg-primary/30 transition-all duration-500 group-hover:w-3/4" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
