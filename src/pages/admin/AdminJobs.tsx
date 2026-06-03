import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jobsApi, type Job } from "@/lib/api";
import { toast } from "sonner";

const AdminJobs = () => {
  const qc = useQueryClient();
  const { data: jobs = [], isLoading, error } = useQuery({ queryKey: ["jobs"], queryFn: jobsApi.getAll });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState({ title: "", location: "", status: "open", description: "" });

  const createMut = useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["jobs"] }); toast.success("Job added"); setShowForm(false); },
    onError: (e) => toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Job> }) => jobsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["jobs"] }); toast.success("Updated"); setShowForm(false); },
    onError: (e) => toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });
  const deleteMut = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["jobs"] }); toast.success("Deleted"); },
    onError: (e) => toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const openAdd = () => { setEditing(null); setForm({ title: "", location: "", status: "open", description: "" }); setShowForm(true); };
  const openEdit = (j: Job) => { setEditing(j); setForm({ title: j.title, location: j.location, status: j.status, description: j.description }); setShowForm(true); };

  const handleSave = () => {
    if (!form.title) return;
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Jobs Management</h1>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus size={16} /> Add job
        </button>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading…</div>}
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">Failed to load jobs.</div>}

      {!isLoading && jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No jobs posted yet. Add your first job listing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{j.title}</h3>
                <p className="text-xs text-muted-foreground">{j.location} · {j.status}</p>
              </div>
              <button onClick={() => openEdit(j)} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={14} /></button>
              <button onClick={() => confirm("Delete?") && deleteMut.mutate(j.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">{editing ? "Edit" : "Add"} Job</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                    <option value="open">Open</option><option value="closed">Closed</option><option value="draft">Draft</option>
                  </select>
                </div>
                <textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                <button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">{createMut.isPending || updateMut.isPending ? "Saving…" : editing ? "Save" : "Add"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminJobs;
