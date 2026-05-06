import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { settingsApi, type SiteSettings } from "@/lib/api";
import { toast } from "sonner";

const FIELDS: { key: keyof SiteSettings; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "hero_eyebrow", label: "Hero Eyebrow Tag", placeholder: "Citizen Infotech · Software Studio" },
  { key: "hero_title_line1", label: "Hero Title Line 1", placeholder: "Engineering software" },
  { key: "hero_title_line2", label: "Hero Title Line 2", placeholder: "that moves ambitious" },
  { key: "hero_title_line3", label: "Hero Title Line 3 (with highlight word)", placeholder: "businesses forward." },
  { key: "hero_description", label: "Hero Description", placeholder: "Citizen Infotech provides...", multiline: true },
  { key: "hero_cta_primary", label: "Primary CTA Label", placeholder: "Start a project" },
  { key: "hero_cta_secondary", label: "Secondary CTA Label", placeholder: "See our work" },
  { key: "services_eyebrow", label: "Services Eyebrow", placeholder: "What we do" },
  { key: "services_title", label: "Services Title", placeholder: "Services built around outcomes..." },
  { key: "services_description", label: "Services Description", placeholder: "From early-stage product strategy...", multiline: true },
  { key: "work_eyebrow", label: "Work Eyebrow", placeholder: "Selected work" },
  { key: "work_title", label: "Work Title", placeholder: "Projects we've shipped." },
  { key: "cta_title", label: "Bottom CTA Title", placeholder: "Ready to build something great?" },
  { key: "cta_description", label: "Bottom CTA Description", placeholder: "Let's turn your idea...", multiline: true },
];

const AdminHome = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get });
  const [form, setForm] = useState<SiteSettings>({});

  useEffect(() => { if (data) setForm(data); }, [data]);

  const mut = useMutation({
    mutationFn: (d: Partial<SiteSettings>) => settingsApi.update(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); toast.success("Home content saved"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const handleChange = (k: keyof SiteSettings, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Home Page Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">Edit titles and copy that appear on the public homepage.</p>
        </div>
        <button
          onClick={() => mut.mutate(form)}
          disabled={mut.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {mut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{f.label}</label>
              {f.multiline ? (
                <textarea
                  rows={3}
                  value={(form[f.key] as string) || ""}
                  placeholder={f.placeholder}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              ) : (
                <input
                  value={(form[f.key] as string) || ""}
                  placeholder={f.placeholder}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
