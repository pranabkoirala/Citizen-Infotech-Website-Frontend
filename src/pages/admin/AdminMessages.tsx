import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen, Trash2, X, Loader2, Reply } from "lucide-react";
import { messagesApi, type ContactMessage } from "@/lib/api";
import { toast } from "sonner";

const AdminMessages = () => {
  const qc = useQueryClient();
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: messagesApi.getAll,
  });

  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const markReadMut = useMutation({
    mutationFn: messagesApi.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });

  const deleteMut = useMutation({
    mutationFn: messagesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted");
      setSelected(null);
    },
    onError: (e) => toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const openMessage = (m: ContactMessage) => {
    setSelected(m);
    if (!m.read) markReadMut.mutate(m.id);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-sm text-muted-foreground">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Failed to load messages. Is the backend running?
        </div>
      )}

      {!isLoading && messages.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Mail size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => openMessage(m)}
              className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                m.read
                  ? "border-border bg-card hover:bg-secondary/50"
                  : "border-primary/30 bg-primary/5 hover:bg-primary/10"
              }`}
            >
              {m.read ? (
                <MailOpen size={16} className="text-muted-foreground" />
              ) : (
                <Mail size={16} className="text-primary" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm truncate ${m.read ? "text-foreground" : "font-semibold text-foreground"}`}>
                    {m.name}
                  </p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.message}</p>
              </div>
              {m.created_at && (
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">{selected.name}</h2>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                  {selected.created_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-6 rounded-lg border border-border bg-background p-4">
                <p className="whitespace-pre-wrap text-sm text-foreground">{selected.message}</p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your message&body=Hi ${selected.name},%0D%0A%0D%0A`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Reply size={14} /> Reply
                </a>
                <button
                  onClick={() => confirm("Delete this message?") && deleteMut.mutate(selected.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
