import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { insideApi, mediaUrl, type InsideMedia } from "@/lib/api";

const SortableMedia = ({ item, onDelete, onEdit }: { item: InsideMedia; onDelete: () => void; onEdit: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.55 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical size={16} />
      </button>
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-secondary">
        {item.media_type === "video" ? (
          <video src={mediaUrl(item.media_url)} className="h-full w-full object-cover" muted />
        ) : (
          <img src={mediaUrl(item.media_url)} alt={item.title || "Inside media"} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.title || "Untitled"}</p>
        <p className="text-xs capitalize text-muted-foreground">{item.media_type}</p>
      </div>
      <button onClick={onEdit} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
        <Pencil size={14} />
      </button>
      <button onClick={onDelete} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
        <Trash2 size={14} />
      </button>
    </div>
  );
};

const AdminInside = () => {
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const { data: media = [], isLoading, error } = useQuery({ queryKey: ["inside"], queryFn: insideApi.getAll });

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<InsideMedia | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const uploadMut = useMutation({
    mutationFn: () => {
      const data = new FormData();
      if (title) data.append("title", title);
      if (file) data.append("file", file);
      data.append("order_index", String(media.length));
      return insideApi.upload(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inside"] });
      setTitle("");
      setFile(null);
      toast.success("Media uploaded");
    },
    onError: (e) => toast.error(`Upload failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, value }: { id: number; value: string }) => insideApi.update(id, { title: value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inside"] });
      setEditing(null);
      toast.success("Media updated");
    },
    onError: (e) => toast.error(`Update failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const reorderMut = useMutation({
    mutationFn: insideApi.reorder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inside"] }),
    onError: (e) => toast.error(`Reorder failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const deleteMut = useMutation({
    mutationFn: insideApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inside"] });
      toast.success("Media deleted");
    },
    onError: (e) => toast.error(`Delete failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const handleUpload = () => {
    if (!file) {
      toast.error("Choose an image or video first");
      return;
    }
    uploadMut.mutate();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = media.findIndex((item) => item.id === active.id);
    const newIndex = media.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(media, oldIndex, newIndex);
    qc.setQueryData(["inside"], reordered);
    reorderMut.mutate(reordered.map((item, index) => ({ id: item.id, order_index: index })));
  };

  const openEdit = (item: InsideMedia) => {
    setEditing(item);
    setEditTitle(item.title || "");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Life at citizen infotech</h1>
        <p className="text-sm text-muted-foreground">Upload images and videos, then drag to control their order.</p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Team lunch, office day, launch event..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Image or video</span>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:text-foreground"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={uploadMut.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {uploadMut.isPending ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            Upload
          </button>
        </div>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading...</div>}
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">Failed to load inside media.</div>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={media.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {media.map((item) => (
              <SortableMedia
                key={item.id}
                item={item}
                onEdit={() => openEdit(item)}
                onDelete={() => confirm("Delete this media item?") && deleteMut.mutate(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Edit Title</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => updateMut.mutate({ id: editing.id, value: editTitle })}
              disabled={updateMut.isPending}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Save title
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInside;
