import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { servicesApi, type Service } from "@/lib/api";
import { toast } from "sonner";

const empty: Omit<Service, "id"> = { title: "", description: "", icon: "", order_index: 0, show_on_home: true };

const SortableService = ({
  service,
  onToggleHome,
  onEdit,
  onDelete,
}: {
  service: Service;
  onToggleHome: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-lg">
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical size={16} />
      </button>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-foreground">{service.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{service.description}</p>
      </div>
      <button
        onClick={onToggleHome}
        title={service.show_on_home ? "Visible on home" : "Hidden from home"}
        className={`rounded p-1.5 ${service.show_on_home ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-secondary"}`}
      >
        {service.show_on_home ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button onClick={onEdit} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={14} /></button>
      <button onClick={onDelete} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
    </div>
  );
};

const AdminServices = () => {
  const qc = useQueryClient();
  const { data: services = [], isLoading } = useQuery({ queryKey: ["services"], queryFn: servicesApi.getAll });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(empty);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const invalidate = () => qc.invalidateQueries({ queryKey: ["services"] });

  const reorderMut = useMutation({
    mutationFn: servicesApi.reorder,
    onSuccess: invalidate,
    onError: (e) => toast.error(`Reorder failed: ${e instanceof Error ? e.message : "error"}`),
  });

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((service) => service.id === active.id);
      const newIndex = services.findIndex((service) => service.id === over.id);
      const reordered = arrayMove(services, oldIndex, newIndex);
      qc.setQueryData(["services"], reordered);
      reorderMut.mutate(reordered.map((service, index) => ({ id: service.id, order_index: index })));
    }
  };

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
          <p className="mt-1 text-xs text-muted-foreground">Drag services to reorder. Toggle eye to show on homepage.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus size={16} /> Add service
        </button>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading…</div>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={services.map((service) => service.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {services.map((service) => (
              <SortableService
                key={service.id}
                service={service}
                onToggleHome={() => toggleHome(service)}
                onEdit={() => openEdit(service)}
                onDelete={() => confirm("Delete?") && deleteMut.mutate(service.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
                <input placeholder="Icon name (optional, lucide)" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
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
