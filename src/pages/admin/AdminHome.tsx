import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { mediaUrl, settingsApi, type SiteSettings } from "@/lib/api";
import { testimonials as fallbackTestimonials, trustedBy as fallbackTrustedBy } from "@/lib/data";
import { toast } from "sonner";

type Testimonial = NonNullable<SiteSettings["testimonials"]>[number];
type TrustedCompany = NonNullable<SiteSettings["trusted_companies"]>[number];

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

const CONTACT_FIELDS: { key: keyof SiteSettings; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "contact_email", label: "Contact Email", placeholder: "info@citizeninfotechnepal.com" },
  { key: "contact_phone", label: "Contact Phone", placeholder: "+977-9768770259" },
  { key: "contact_address", label: "Contact Address", placeholder: "Pashupati Colony, Mid Baneshwor, Kathmandu, Nepal", multiline: true },
];

const createTestimonial = (): Testimonial => ({ name: "", role: "", text: "" });
const createTrustedCompany = (): TrustedCompany => ({ name: "", logo_url: "" });

const cleanTestimonials = (items: SiteSettings["testimonials"] = []) =>
  items
    .map((item) => ({
      name: item.name.trim(),
      role: item.role.trim(),
      text: item.text.trim(),
    }))
    .filter((item) => item.name || item.text);

const cleanTrustedCompanies = (items: SiteSettings["trusted_companies"] = []) =>
  items
    .map((item) => ({
      name: item.name.trim(),
      logo_url: item.logo_url || null,
    }))
    .filter((item) => item.name || item.logo_url);

const prepareSettings = (settings: SiteSettings): SiteSettings => ({
  ...settings,
  testimonials: cleanTestimonials(settings.testimonials),
  trusted_companies: cleanTrustedCompanies(settings.trusted_companies),
});

const AdminHome = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get });
  const [form, setForm] = useState<SiteSettings>({});
  const [uploadingLogo, setUploadingLogo] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      const savedTestimonials = cleanTestimonials(data.testimonials);
      const savedTrustedCompanies = cleanTrustedCompanies(data.trusted_companies);
      setForm({
        ...data,
        testimonials: data.testimonials ? savedTestimonials : fallbackTestimonials,
        trusted_companies: data.trusted_companies ? savedTrustedCompanies : fallbackTrustedBy,
      });
    }
  }, [data]);

  const mut = useMutation({
    mutationFn: (d: Partial<SiteSettings>) => settingsApi.update(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); toast.success("Home content saved"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const handleChange = (k: keyof SiteSettings, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const saveSettings = () => {
    const payload = prepareSettings(form);
    setForm(payload);
    mut.mutate(payload);
  };
  const addTestimonial = () => {
    setForm((f) => ({ ...f, testimonials: [createTestimonial(), ...(f.testimonials || [])] }));
  };
  const addTrustedCompany = () => {
    setForm((f) => ({ ...f, trusted_companies: [createTrustedCompany(), ...(f.trusted_companies || [])] }));
  };
  const updateTestimonial = (index: number, key: keyof Testimonial, value: string) => {
    setForm((f) => ({
      ...f,
      testimonials: (f.testimonials || []).map((item, i) => i === index ? { ...item, [key]: value } : item),
    }));
  };
  const moveTestimonial = (index: number, direction: -1 | 1) => {
    setForm((f) => {
      const testimonials = [...(f.testimonials || [])];
      const target = index + direction;
      if (target < 0 || target >= testimonials.length) return f;
      [testimonials[index], testimonials[target]] = [testimonials[target], testimonials[index]];
      return { ...f, testimonials };
    });
  };
  const updateTrustedCompany = (index: number, key: keyof TrustedCompany, value: string) => {
    setForm((f) => ({
      ...f,
      trusted_companies: (f.trusted_companies || []).map((item, i) => i === index ? { ...item, [key]: value } : item),
    }));
  };
  const uploadLogo = async (index: number, file?: File) => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    setUploadingLogo(index);
    try {
      const result = await settingsApi.uploadLogo(body);
      updateTrustedCompany(index, "logo_url", result.url);
      toast.success("Logo uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Logo upload failed");
    } finally {
      setUploadingLogo(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Home Page Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">Edit titles, client proof, trusted logos, and website contact details.</p>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          disabled={mut.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {mut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Homepage Copy</h2>
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
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Client Testimonials</h2>
              <button type="button" onClick={addTestimonial} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/40">
                <Plus size={14} /> Add testimonial
              </button>
            </div>
            {(form.testimonials || []).map((item, index) => (
              <div key={index} className="rounded-lg border border-border bg-background p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveTestimonial(index, -1)}
                      disabled={index === 0}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowUp size={13} /> Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTestimonial(index, 1)}
                      disabled={index === (form.testimonials || []).length - 1}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowDown size={13} /> Down
                    </button>
                  </div>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, testimonials: (f.testimonials || []).filter((_, i) => i !== index) }))} className="inline-flex items-center gap-1 text-xs text-destructive">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={item.name} placeholder="Client name" onChange={(e) => updateTestimonial(index, "name", e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                  <input value={item.role} placeholder="Role / company" onChange={(e) => updateTestimonial(index, "role", e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
                <textarea value={item.text} rows={3} placeholder="Testimonial text" onChange={(e) => updateTestimonial(index, "text", e.target.value)} className="mt-3 w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Trusted Companies</h2>
              <button type="button" onClick={addTrustedCompany} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/40">
                <Plus size={14} /> Add company
              </button>
            </div>
            {(form.trusted_companies || []).map((item, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border bg-background p-4 md:grid-cols-[64px_1fr_auto_auto] md:items-center">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-xs font-bold text-primary">
                  {item.logo_url ? <img src={mediaUrl(item.logo_url)} alt="" className="h-full w-full object-contain p-2" /> : "Logo"}
                </div>
                <input value={item.name} placeholder="Company name" onChange={(e) => updateTrustedCompany(index, "name", e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/40">
                  {uploadingLogo === index ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { uploadLogo(index, e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                <button type="button" onClick={() => setForm((f) => ({ ...f, trusted_companies: (f.trusted_companies || []).filter((_, i) => i !== index) }))} className="inline-flex items-center justify-center gap-1 rounded-lg border border-destructive/30 px-3 py-2 text-xs text-destructive">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Website Contact Details</h2>
            {CONTACT_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-xs font-medium text-foreground">{f.label}</label>
                {f.multiline ? (
                  <textarea rows={3} value={(form[f.key] as string) || ""} placeholder={f.placeholder} onChange={(e) => handleChange(f.key, e.target.value)} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                ) : (
                  <input value={(form[f.key] as string) || ""} placeholder={f.placeholder} onChange={(e) => handleChange(f.key, e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                )}
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
