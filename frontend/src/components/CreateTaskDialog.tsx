import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

import { createTaskApi } from "../api/tasks";
import type { RootState } from "../app/store";

type TaskType = "BUG" | "FEATURE" | "TASK" | "IMPROVEMENT" | "OTHER";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface Props {
  showCreateTask: boolean;
  setShowCreateTask: (v: boolean) => void;
  projectId: string;
  onTaskCreated?: () => void;
}

interface FormData {
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  due_date: string;
}

export default function CreateTaskDialog({
  showCreateTask,
  setShowCreateTask,
  projectId,
  onTaskCreated,
}: Props) {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const project = currentWorkspace?.projects.find(
    (p) => p.id === projectId
  );

  const teamMembers = project?.members ?? [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "TASK",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "",
    due_date: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "task title required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateForm()) return;
    e.preventDefault();
    if (!projectId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createTaskApi(projectId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        assignee_id: formData.assigneeId || null,
        due_date: formData.due_date || null,
      });

      onTaskCreated?.();

      setFormData({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: "",
        due_date: "",
      });

      setShowCreateTask(false);
    } catch {
      alert("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCreateTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Title"
            className="w-full rounded border px-3 py-2"
            required
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
            className="w-full rounded border px-3 py-2 h-24"
          />

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as TaskType,
              })
            }
            className="w-full rounded border px-3 py-2"
          >
            <option value="TASK">Task</option>
            <option value="BUG">Bug</option>
            <option value="FEATURE">Feature</option>
            <option value="IMPROVEMENT">Improvement</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={formData.assigneeId}
            onChange={(e) =>
              setFormData({ ...formData, assigneeId: e.target.value })
            }
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.user.id} value={m.user.id}>
                {m.user.email}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  due_date: e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {formData.due_date && (
            <p className="text-xs text-zinc-500">
              {format(new Date(formData.due_date), "PPP")}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateTask(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
