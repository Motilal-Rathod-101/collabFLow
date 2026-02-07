import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

import { addTask,setProjectTasks } from "../features/workspaceSlice";
import { createTaskApi } from "../api/tasks";
import { getTasks } from "../api/tasks";


// types
type TaskType = "BUG" | "FEATURE" | "TASK" | "IMPROVEMENT" | "OTHER";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface User {
  id: string;
  email: string;
}

interface Member {
  user: User;
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

export default function CreateTaskDialog({
  showCreateTask,
  setShowCreateTask,
  projectId,
}: CreateTaskDialogProps) {
  const dispatch = useDispatch();

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace?.currentWorkspace || null
  );

  const project = currentWorkspace?.projects.find(
    (p) => p.id === projectId
  );

  const teamMembers = project?.members || [];

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

  // submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectId) return;

    setIsSubmitting(true);

    try {
      // API CALL
      const task = await createTaskApi(projectId, {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assigneeId || null,
        due_date: formData.due_date || null,
        });

      dispatch(addTask(task));
    //   dispatch(fetchTasks(projectId));
    const tasks = await getTasks(projectId);
dispatch(setProjectTasks({ projectId, tasks }));
      setShowCreateTask(false);

      setFormData({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: "",
        due_date: "",
      });
    } catch (error) {
      console.error("Task creation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCreateTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur">
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
              setFormData({ ...formData, type: e.target.value as TaskType })
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
                setFormData({ ...formData, due_date: e.target.value })
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
