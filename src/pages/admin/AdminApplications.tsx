import { useState } from "react";
import type { Application } from "@/lib/api";
import { Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockApps: Application[] = [];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  reviewed: "bg-blue-500/10 text-blue-400",
  shortlisted: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
};

const AdminApplications = () => {
  const [apps] = useState<Application[]>(mockApps);
  const [selected, setSelected] = useState<Application | null>(null);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">Applications</h1>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No applications received yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map((a) => (
            <div key={a.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.email} · {a.job_title}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[a.status]}`}>{a.status}</span>
              <button onClick={() => setSelected(a)} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Eye size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">{selected.name}</h2>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Email:</strong> {selected.email}</p>
                <p><strong className="text-foreground">Job:</strong> {selected.job_title}</p>
                <p><strong className="text-foreground">Applied:</strong> {selected.applied_at}</p>
                {selected.cover_letter && <p><strong className="text-foreground">Cover Letter:</strong> {selected.cover_letter}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminApplications;
