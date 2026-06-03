import { useQuery } from "@tanstack/react-query";
import { Building2, ImageOff, Play } from "lucide-react";
import { motion } from "framer-motion";

import AnimatedSection from "@/components/AnimatedSection";
import GradientOrbs from "@/components/GradientOrbs";
import Layout from "@/components/Layout";
import { insideApi, mediaUrl } from "@/lib/api";

const Inside = () => {
  const { data: media = [], isLoading } = useQuery({ queryKey: ["inside"], queryFn: insideApi.getAll, retry: false });

  return (
    <Layout>
      <section className="relative overflow-hidden section-padding !pt-28">
        <GradientOrbs />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container-tight relative">
          <AnimatedSection>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
              <Building2 size={12} className="text-primary" />
              <span className="text-xs font-medium text-primary">Life at citizen infotech</span>
            </div>
            <h1 className="max-w-2xl font-heading text-4xl font-bold text-foreground md:text-5xl">
              A closer look at the people, spaces, and moments behind our work.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Photos and videos from our team, office, events, and everyday build culture.
            </p>
          </AnimatedSection>

          {isLoading ? (
            <div className="mt-12 text-sm text-muted-foreground">Loading gallery...</div>
          ) : media.length === 0 ? (
            <AnimatedSection className="mt-12">
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-card/60 p-8 text-center">
                <ImageOff size={28} className="text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">No life moments have been added yet.</p>
              </div>
            </AnimatedSection>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="mt-12 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3"
            >
              {media.map((item) => (
                <motion.figure
                  key={item.id}
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                  className="break-inside-avoid"
                >
                  <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
                    {item.media_type === "video" ? (
                      <video
                        src={mediaUrl(item.media_url)}
                        controls
                        playsInline
                        className="w-full bg-black object-cover"
                      />
                    ) : (
                      <img
                        src={mediaUrl(item.media_url)}
                        alt={item.title || "Life at citizen infotech"}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {item.media_type === "video" && (
                      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/80 p-2 text-primary backdrop-blur">
                        <Play size={14} />
                      </div>
                    )}
                  </div>
                  {item.title && <figcaption className="mt-2 text-sm text-muted-foreground">{item.title}</figcaption>}
                </motion.figure>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Inside;
