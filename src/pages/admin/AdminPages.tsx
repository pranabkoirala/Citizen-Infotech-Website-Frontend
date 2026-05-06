import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { pagesApi } from "@/lib/api";

const pages = [
  { slug: "about", title: "About Us", content: "Citizen Infotech provides innovative, scalable solutions to drive business growth and efficiency." },
  { slug: "why-us", title: "Why Us", content: "A team you can stand behind." },
];

const AdminPages = () => {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(pages[0]);
  const [draftContent, setDraftContent] = useState<string | null>(null);

  const pageQuery = useQuery({
    queryKey: ["page", selected.slug],
    queryFn: () => pagesApi.get(selected.slug),
    retry: false,
  });

  const content = draftContent ?? pageQuery.data?.content ?? selected.content;

  const updateMut = useMutation({
    mutationFn: () => pagesApi.update(selected.slug, { content }),
    onSuccess: (page) => {
      qc.setQueryData(["page", selected.slug], page);
      setDraftContent(null);
      toast.success("Page content saved");
    },
    onError: (e) => toast.error(`Save failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const handleSelect = (slug: string) => {
    const page = pages.find((p) => p.slug === slug)!;
    setSelected(page);
    setDraftContent(null);
  };

  const handleSave = () => {
    updateMut.mutate();
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">Page Editor</h1>

      <div className="mb-4 flex gap-2">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => handleSelect(p.slug)}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${
              selected.slug === p.slug ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Content</label>
        {pageQuery.isLoading && (
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            Loading saved content...
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setDraftContent(e.target.value)}
          rows={12}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <button
          onClick={handleSave}
          disabled={updateMut.isPending}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {updateMut.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save changes
        </button>
      </div>
    </div>
  );
};

export default AdminPages;
