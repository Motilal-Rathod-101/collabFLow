import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

import { setProjectTasks } from "../features/workspaceSlice";
import { createTaskApi, getTasks } from "../api/tasks";

//  TYPES 
type TaskType = "BUG" | "FEATURE" | "TASK" | "IMPROVEMENT" | "OTHER";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface User {
  id: string;
  email: string;
}

interface Member {
  user: User | string; 
  email?: string;
}

interface Project {
  id: string;
  members: Member[];
}

interface Workspace {
  projects: Project[];
}

interface RootState {
  workspace?: {
    currentWorkspace: Workspace | null;
  };
}

interface CreateTaskDialogProps {
  showCreateTask: boolean;
  setShowCreateTask: (value: boolean) => void;
  projectId: string;
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

// -------------------- COMPONENT --------------------
export default function CreateTaskDialog({
  showCreateTask,
  setShowCreateTask,
  projectId,
}: CreateTaskDialogProps) {
  const dispatch = useDispatch();

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace?.currentWorkspace
  );

  const project = currentWorkspace?.projects.find(
    (p) => p.id === projectId
  );

  const teamMembers = project?.members ?? [];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "TASK",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "",
    due_date: "",
  });

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const tasks = await getTasks(projectId);
      dispatch(setProjectTasks({ projectId, tasks }));

      //  reset and close only after success
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
    } catch (error) {
      console.error("Task creation failed", error);
      alert("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCreateTask) return null;

  // -------------------- UI --------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur">
      <div className="bg-white border rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Title"
            className="w-full rounded border px-3 py-2"
            required
          />

          {/* Description */}
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
            className="w-full rounded border px-3 py-2 h-24"
          />

          {/* Type */}
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

          {/* Assignee */}
          <select
            value={formData.assigneeId}
            onChange={(e) =>
              setFormData({ ...formData, assigneeId: e.target.value })
            }
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Unassigned</option>
            {teamMembers.map((m) => {
              const userId =
                typeof m.user === "string" ? m.user : m.user.id;
              const email =
                typeof m.user === "string"
                  ? m.email
                  : m.user.email;

              return (
                <option key={userId} value={userId}>
                  {email}
                </option>
              );
            })}
          </select>

          {/* Due date */}
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

          {/* Actions */}
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
