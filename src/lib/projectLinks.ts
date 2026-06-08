import type { Project } from "@/lib/api";

export const projectSlug = (project: Pick<Project, "id" | "slug" | "title">) => {
  if (project.slug) return project.slug;
  const slug = project.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || String(project.id);
};

export const projectHref = (project: Pick<Project, "id" | "slug" | "title">) =>
  `/work/${projectSlug(project)}`;
