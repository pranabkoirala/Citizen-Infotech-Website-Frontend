import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragCancelEvent,
  DragEndEvent,
  DragStartEvent,
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
import { mediaUrl, teamApi, type TeamMember, departmentsApi, type Department } from "@/lib/api";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  User,
  X,
  Loader2,
  ImagePlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

/* ──────────────────────── TeamCard ──────────────────────── */
const TeamCard = ({
  member,
  dragHandle,
  onEdit,
  onDelete,
  dragging = false,
}: {
  member: TeamMember;
  dragHandle?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  dragging?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-shadow ${dragging ? "shadow-xl" : "hover:shadow-lg"
      }`}
  >
    {dragHandle}

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary overflow-hidden">
      {member.image_url ? (
        <img
          src={mediaUrl(member.image_url)}
          alt={member.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <User size={16} className="text-muted-foreground" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">
        {member.name}
      </p>
      <p className="text-xs text-muted-foreground">{member.role}</p>
      {member.department?.name && (
        <p className="text-[11px] text-primary mt-0.5">
          {member.department.name}
        </p>
      )}
    </div>

    {onEdit && (
      <button
        onClick={onEdit}
        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Pencil size={14} />
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
);

/* ──────────────────────── SortableItem ──────────────────────── */
const SortableItem = ({
  member,
  onEdit,
  onDelete,
}: {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    touchAction: "none",
    opacity: isDragging ? 0.35 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TeamCard
        member={member}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandle={
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted-foreground hover:text-foreground"
          >
            <GripVertical size={16} />
          </button>
        }
      />
    </div>
  );
};

/* ──────────────────────── DepartmentSection ──────────────────────── */
const DepartmentSection = ({
  deptName,
  deptId,
  members,
  onEdit,
  onDelete,
  reorderMut,
  qc,
}: {
  deptName: string;
  deptId: string | number;
  members: TeamMember[];
  onEdit: (m: TeamMember) => void;
  onDelete: (id: number) => void;
  reorderMut: any;
  qc: any;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [localMembers, setLocalMembers] = useState<TeamMember[]>(members);
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  const activeMember = activeId
    ? localMembers.find((m) => m.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = localMembers.findIndex((m) => m.id === Number(active.id));
    const newIndex = localMembers.findIndex((m) => m.id === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) {
      setActiveId(null);
      return;
    }

    const reordered = arrayMove(localMembers, oldIndex, newIndex);
    setLocalMembers(reordered);

    // Update global cache: replace this department's members with reordered ones
    qc.setQueryData(["team"], (old: TeamMember[] | undefined) => {
      if (!old) return old;
      const otherMembers = old.filter(
        (m) => String(m.department?.id ?? "other") !== String(deptId)
      );
      return [...otherMembers, ...reordered];
    });

    reorderMut.mutate(
      reordered.map((m, i) => ({ id: m.id, order_index: i }))
    );

    setActiveId(null);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-3 flex items-center gap-2 text-left"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {deptName}
        </h2>
        <span className="text-xs text-muted-foreground">
          ({members.length})
        </span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localMembers.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {localMembers.map((m) => (
                    <SortableItem
                      key={m.id}
                      member={m}
                      onEdit={() => onEdit(m)}
                      onDelete={() => onDelete(m.id)}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay dropAnimation={null}>
                {activeMember ? (
                  <TeamCard
                    member={activeMember}
                    dragging
                    dragHandle={
                      <GripVertical size={16} className="text-primary" />
                    }
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────── Image Upload Helper ──────────────────────── */
async function uploadTeamImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const result = await teamApi.uploadImage(body);
  return result.url;
}

/* ──────────────────────── AdminTeam ──────────────────────── */
const AdminTeam = () => {
  const qc = useQueryClient();

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: teamApi.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getAll,
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: "",
    department_id: "" as string | number,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ──────────────────────── Mutations ──────────────────────── */
  const reorderMut = useMutation({
    mutationFn: teamApi.reorder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
    onError: (e) =>
      toast.error(`Reorder failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const createMut = useMutation({
    mutationFn: teamApi.create,
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["team"] });
      toast.success("Member added");
      setShowForm(false);
    },
    onError: (e) =>
      toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TeamMember> }) =>
      teamApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team"] });
      toast.success("Updated");
      setShowForm(false);
    },
    onError: (e) =>
      toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });

  const deleteMut = useMutation({
    mutationFn: teamApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team"] });
      toast.success("Deleted");
    },
    onError: (e) =>
      toast.error(`Failed: ${e instanceof Error ? e.message : "error"}`),
  });

  /* ──────────────────────── Form Handlers ──────────────────────── */
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      role: "",
      bio: "",
      image_url: "",
      department_id: "",
    });
    setImageFile(null);
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio || "",
      image_url: m.image_url || "",
      department_id: m.department_id ?? "",
    });
    setImageFile(null);
    setImagePreview(mediaUrl(m.image_url) || "");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) return;

    let image_url = form.image_url;
    if (imageFile) {
      try {
        setUploadingImage(true);
        image_url = await uploadTeamImage(imageFile);
      } catch {
        toast.error("Image upload failed");
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    const payload = {
      ...form,
      image_url,
      department_id: form.department_id ? Number(form.department_id) : null,
    };

    if (editing) {
      updateMut.mutate({ id: editing.id, data: payload });
    } else {
      createMut.mutate({ ...payload, order_index: members.length });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this team member?")) deleteMut.mutate(id);
  };

  /* ──────────────────────── Group by Department ──────────────────────── */
  const grouped = members.reduce((acc: Record<string, TeamMember[]>, member) => {
    const key = member.department?.id ? String(member.department.id) : "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(member);
    return acc;
  }, {});

  // Sort departments by their order_index if available
  const sortedDeptKeys = Object.keys(grouped).sort((a, b) => {
    const deptA = departments.find((d) => String(d.id) === a);
    const deptB = departments.find((d) => String(d.id) === b);
    if (deptA && deptB) return (deptA.order_index || 0) - (deptB.order_index || 0);
    if (deptA) return -1;
    if (deptB) return 1;
    return 0;
  });

  /* ──────────────────────── Render ──────────────────────── */
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Team Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Drag to reorder within departments. Changes save automatically.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus size={16} /> Add member
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Failed to load team. Is the backend running?
        </div>
      )}

      {/* Department Sections */}
      {sortedDeptKeys.map((deptKey) => {
        const deptMembers = grouped[deptKey];
        const dept = departments.find((d) => String(d.id) === deptKey);
        const deptName = dept?.name || "Other";

        return (
          <DepartmentSection
            key={deptKey}
            deptName={deptName}
            deptId={deptKey}
            members={deptMembers}
            onEdit={openEdit}
            onDelete={handleDelete}
            reorderMut={reorderMut}
            qc={qc}
          />
        );
      })}

      {/* ──────────── Form Modal ──────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {editing ? "Edit" : "Add"} Member
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <input
                  placeholder="Role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />

                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((d: Department) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                  >
                    <ImagePlus size={16} />
                    {imageFile ? imageFile.name : "Upload photo (optional)"}
                  </button>
                  {imagePreview && (
                    <div className="relative mt-2 flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-14 w-14 rounded-full object-cover border border-border"
                      />
                      <span className="text-xs text-muted-foreground">
                        {imageFile ? "New image selected" : "Current image"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          setForm({ ...form, image_url: "" });
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="ml-auto rounded p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="Bio (optional)"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />

                <button
                  onClick={handleSave}
                  disabled={
                    uploadingImage || createMut.isPending || updateMut.isPending
                  }
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {uploadingImage
                    ? "Uploading image…"
                    : createMut.isPending || updateMut.isPending
                      ? "Saving…"
                      : editing
                        ? "Save changes"
                        : "Add member"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTeam;