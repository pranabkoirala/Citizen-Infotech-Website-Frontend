import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { servicesApi, type Service } from "@/lib/api";
import { toast } from "sonner";

const empty: Omit<Service, "id"> = { title: "", description: "", icon: "", order_index: 0, show_on_home: true };

const AdminServices = () => {
  const qc = useQueryClient();
  const { data: services = [], isLoading } = useQuery({ queryKey: ["services"], queryFn: servicesApi.getAll });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(empty);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["services"] });

  const createMut = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => { invalidate(); toast.success("Service added"); setShowForm(false); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Service> }) => servicesApi.update(id, data),
    onSuccess: () => { invalidate(); toast.success("Updated"); setShowForm(false); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const deleteMut = useMutation({
    mutationFn: servicesApi.delete,
    onSuccess: () => { invalidate(); toast.success("Deleted"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const toggleHome = (s: Service) =>
    updateMut.mutate({ id: s.id, data: { show_on_home: !s.show_on_home } });

  const openAdd = () => { setEditing(null); setForm({ ...empty, order_index: services.length }); setShowForm(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, icon: s.icon || "", order_index: s.order_index ?? 0, show_on_home: !!s.show_on_home });
    setShowForm(true);
  };
  const handleSave = () => {
    if (!form.title) return;
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">What We Do · Services</h1>
          <p className="mt-1 text-xs text-muted-foreground">Manage the "What we do" cards. Toggle eye to show on homepage.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus size={16} /> Add service
        </button>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading…</div>}

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{s.description}</p>
            </div>
            <button
              onClick={() => toggleHome(s)}
              title={s.show_on_home ? "Visible on home" : "Hidden from home"}
              className={`rounded p-1.5 ${s.show_on_home ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {s.show_on_home ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button onClick={() => openEdit(s)} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={14} /></button>
            <button onClick={() => confirm("Delete?") && deleteMut.mutate(s.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">{editing ? "Edit" : "Add"} Service</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Icon name (optional, lucide)" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  <input type="number" placeholder="Order" value={form.order_index ?? 0} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={!!form.show_on_home} onChange={(e) => setForm({ ...form, show_on_home: e.target.checked })} />
                  Show on homepage
                </label>
                <button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
                  {createMut.isPending || updateMut.isPending ? "Saving…" : editing ? "Save" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;
