import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import GradientOrbs from "@/components/GradientOrbs";
import { projects as fallbackProjects } from "@/lib/data";
import { mediaUrl, projectsApi } from "@/lib/api";
import { projectHref } from "@/lib/projectLinks";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Code } from "lucide-react";
import { Link } from "react-router-dom";

const Work = () => {
  const { data: liveProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
    retry: false,
  });

  const projects =
    liveProjects && liveProjects.length > 0
      ? liveProjects
      : fallbackProjects;

  return (
    <Layout>
      <section className="relative overflow-hidden section-padding !pb-16 !pt-28 lg:!pb-20">
        <GradientOrbs />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 items-center rounded-full border border-primary/30 bg-primary/5 px-3">
                <span className="text-xs font-medium text-primary">
                  {projects?.length} projects
                </span>
              </div>
            </div>

            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Software we've shipped across health, education and{" "}
              <span className="gradient-text">government.</span>
            </h1>

            <p className="mt-4 text-muted-foreground">
              Platforms, products and tools — engineered for organizations doing
              meaningful work, deployed in production, used every day.
            </p>
          </AnimatedSection>

          {/* PROJECT LIST */}
          <div className="mt-10 flex flex-col gap-4">
            {projects?.map((p, i) => (
              <Link
                key={p.id}
                to={projectHref(p)}
                className="
    glass-card-hover group
    flex flex-col sm:flex-row
    gap-4 sm:gap-6
    rounded-xl p-4 sm:p-6
    cursor-pointer w-full
  "
                aria-label={`Open ${p.title} project details`}
              >
                {/* IMAGE - TOP ON MOBILE */}
                <div className="flex h-40 w-full sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 overflow-hidden">
                  {p?.image_url ? (
                    <img
                      src={mediaUrl(p.image_url)}
                      alt={p.title || "project image"}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <Code size={28} className="text-primary/50" />
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 min-w-0 w-full max-w-2xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-heading text-xs font-bold text-primary/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {p.category && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {p.category}
                      </span>
                    )}

                    {p.year && (
                      <span className="text-xs text-muted-foreground">
                        {p.year}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-heading text-xl font-semibold text-foreground">
                    {p.title}
                  </h3>

                  <p
                    className="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground break-words"
                  >
                    {p.description}
                  </p>
                </div>

                {/* ICON */}
                <ArrowUpRight
                  size={18}
                  className="mt-2 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary"
                />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection className="mt-5 md:mt-6">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-7 text-center md:p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Have a system to build?
              </h2>

              <p className="mt-2 text-muted-foreground">
                Tell us what you're working on — we'll get back within one
                business day.
              </p>

              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
              >
                Start a project
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Work;
