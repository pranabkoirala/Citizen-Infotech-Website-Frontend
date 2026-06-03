import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mediaUrl, projectsApi, type Project } from "@/lib/api";
import { toast } from "sonner";

type WorkForm = {
  title: string;
  category: string;
  year: string;
  description: string;
  visible_on_home: boolean;
  order_index?: number;
};

const empty: WorkForm = {
  title: "",
  category: "web",
  year: "2025",
  description: "",
  visible_on_home: true,
  order_index: 0,
};

const projectToFormData = (form: WorkForm, imageFile: File | null) => {
  const data = new FormData();
  data.append("title", form.title);
  data.append("category", form.category);
  data.append("year", form.year);
  data.append("description", form.description);
  data.append("visible_on_home", String(form.visible_on_home));
  data.append("order_index", String(form.order_index ?? 0));
  if (imageFile) data.append("img_upload", imageFile);
  return data;
};

const SortableProject = ({
  project,
  onToggleHome,
  onEdit,
  onDelete,
}: {
  project: Project;
  onToggleHome: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex h-12 w-16 items-center justify-center rounded-md bg-secondary overflow-hidden">
        {project.image_url ? (
          <img
            src={mediaUrl(project.image_url)}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon size={16} className="text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">
            {project.title}
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">
            {project.category}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {project.year}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-1">
          {project.description}
        </p>
      </div>

      <button
        onClick={onToggleHome}
        className="p-1.5 rounded hover:bg-secondary"
      >
        {project.visible_on_home ? (
          <Eye size={14} className="text-primary" />
        ) : (
          <EyeOff size={14} />
        )}
      </button>

      <button
        onClick={onEdit}
        className="p-1.5 rounded hover:bg-secondary"
      >
        <Pencil size={14} />
      </button>

      <button
        onClick={onDelete}
        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

const AdminWorks = () => {
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<WorkForm>(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["projects"] });

  const reorderMut = useMutation({
    mutationFn: projectsApi.reorder,
    onSuccess: invalidate,
    onError: (e) =>
      toast.error(`Reorder failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> | FormData }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setEditing(null);
      setForm(empty);
      setImageFile(null);
    },
  });

  const createMut = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setForm(empty);
      setImageFile(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: invalidate,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(projects, oldIndex, newIndex);

    qc.setQueryData(["projects"], reordered);

    reorderMut.mutate(
      reordered.map((p, i) => ({
        id: p.id,
        order_index: i,
      }))
    );
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      year: p.year,
      description: p.description,
      visible_on_home: p.visible_on_home ?? true,
      order_index: p.order_index ?? 0,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = () => {
    const data = projectToFormData(form, imageFile);

    if (editing) {
      updateMut.mutate({ id: editing.id, data });
    } else {
      createMut.mutate(data);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Works / Projects
        </h1>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          <Plus size={16} /> Add work
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="animate-spin" size={14} />
          Loading...
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {projects.map((p) => (
              <SortableProject
                key={p.id}
                project={p}
                onToggleHome={() =>
                  updateMut.mutate({
                    id: p.id,
                    data: { visible_on_home: !p.visible_on_home },
                  })
                }
                onEdit={() => openEdit(p)}
                onDelete={() => deleteMut.mutate(p.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* MODAL (THEME FIXED) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-xl border border-border bg-card p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {editing ? "Edit Project" : "Add Project"}
                </h2>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />

                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />

                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value })
                  }
                />

                <textarea
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <input
                  type="file"
                  className="text-muted-foreground"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                />

                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.visible_on_home}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        visible_on_home: e.target.checked,
                      })
                    }
                  />
                  Visible on home
                </label>

                <button
                  onClick={handleSave}
                  className="w-full rounded-lg bg-primary py-2 text-primary-foreground"
                >
                  {editing ? "Save changes" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWorks;
