import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DndContext,
    DragOverlay,
    closestCenter,
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

import { departmentsApi, type Department } from "@/lib/api";
import { GripVertical, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

/* ---------------- Department Card ---------------- */

const DepartmentCard = ({
    department,
    dragHandle,
    onEdit,
    onDelete,
    dragging = false,
}: {
    department: Department;
    dragHandle?: React.ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    dragging?: boolean;
}) => {
    return (
        <div
            className={`flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-shadow ${dragging ? "shadow-xl" : "hover:shadow-lg"
                }`}
        >
            {dragHandle}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                    {department.name}
                </p>
                <p className="text-xs text-muted-foreground">
                    Order: {department.order_index}
                </p>
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
};

/* ---------------- Sortable Item ---------------- */

const SortableItem = ({
    department,
    onEdit,
    onDelete,
}: {
    department: Department;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: department.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <DepartmentCard
                department={department}
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

/* ---------------- Main Component ---------------- */

const AdminDepartment = () => {
    const qc = useQueryClient();

    const { data = [], isLoading, error } = useQuery({
        queryKey: ["departments"],
        queryFn: departmentsApi.getAll,
    });

    const [ordered, setOrdered] = useState<Department[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Department | null>(null);
    const [name, setName] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    /* sync query → local state */
    useEffect(() => {
        if (!activeId) setOrdered(data);
    }, [data, activeId]);

    const activeDepartment = activeId
        ? ordered.find((d) => d.id === activeId)
        : null;

    /* ---------------- Mutations ---------------- */

    const createMut = useMutation({
        mutationFn: departmentsApi.create,
        onSuccess: (created) => {
            const next = [...ordered, created];
            setOrdered(next);
            qc.setQueryData(["departments"], next);
            toast.success("Department created");
            setShowForm(false);
            setName("");
        },
        onError: (e) =>
            toast.error(e instanceof Error ? e.message : "Create failed"),
    });

    const updateMut = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) =>
            departmentsApi.update(id, { name }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["departments"] });
            toast.success("Updated");
            setShowForm(false);
        },
        onError: (e) =>
            toast.error(e instanceof Error ? e.message : "Update failed"),
    });

    const deleteMut = useMutation({
        mutationFn: departmentsApi.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["departments"] });
            toast.success("Deleted");
        },
    });

    const reorderMut = useMutation({
        mutationFn: departmentsApi.reorder,
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ["departments"] }),
        onError: (e) =>
            toast.error(e instanceof Error ? e.message : "Reorder failed"),
    });

    /* ---------------- Drag ---------------- */

    const handleDragStart = (e: DragStartEvent) => {
        setActiveId(Number(e.active.id));
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over || active.id === over.id) {
            setActiveId(null);
            return;
        }

        const oldIndex = ordered.findIndex((i) => i.id === active.id);
        const newIndex = ordered.findIndex((i) => i.id === over.id);

        const reordered = arrayMove(ordered, oldIndex, newIndex);

        setOrdered(reordered);
        qc.setQueryData(["departments"], reordered);

        reorderMut.mutate(
            reordered.map((d, i) => ({
                id: d.id,
                order_index: i,
            }))
        );

        setActiveId(null);
    };

    /* ---------------- Actions ---------------- */

    const openAdd = () => {
        setEditing(null);
        setName("");
        setShowForm(true);
    };

    const openEdit = (d: Department) => {
        setEditing(d);
        setName(d.name);
        setShowForm(true);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        if (editing) {
            updateMut.mutate({ id: editing.id, name });
        } else {
            createMut.mutate({ name, order_index: ordered.length });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this department?")) {
            deleteMut.mutate(id);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <p className="text-sm text-muted-foreground">
                        Drag to reorder departments
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                    <Plus size={16} /> Add Department
                </button>
            </div>

            {/* States */}
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="animate-spin" size={14} /> Loading...
                </div>
            )}

            {error && (
                <div className="text-sm text-red-500">
                    Failed to load departments
                </div>
            )}

            {/* List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={ordered.map((d) => d.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {ordered.map((d) => (
                            <SortableItem
                                key={d.id}
                                department={d}
                                onEdit={() => openEdit(d)}
                                onDelete={() => handleDelete(d.id)}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeDepartment ? (
                        <DepartmentCard
                            department={activeDepartment}
                            dragging
                            dragHandle={<GripVertical size={16} />}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md rounded-lg bg-card p-5"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <div className="mb-4 flex justify-between">
                                <h2 className="text-lg font-bold">
                                    {editing ? "Edit" : "Add"} Department
                                </h2>
                                <button onClick={() => setShowForm(false)}>
                                    <X size={18} />
                                </button>
                            </div>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Department name"
                                className="w-full rounded border p-2"
                            />

                            <button
                                onClick={handleSave}
                                className="mt-4 w-full rounded bg-primary py-2 text-white"
                            >
                                Save
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDepartment;