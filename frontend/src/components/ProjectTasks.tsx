import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import { updateTaskApi, deleteTasksApi } from "../api/tasks";
import {
  Bug,
  CalendarIcon,
  GitCommit,
  MessageSquare,
  Square,
  Trash,
  XIcon,
  Zap,
} from "lucide-react";
import type { RootState } from "../app/store";

export interface TaskAssignee {
  id: string;
  name: string;
  image?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type?: TaskType;
  priority?: TaskPriority;
  due_date?: string;
  assignee?: TaskAssignee;
  projectId: string;
}

type TaskType = "BUG" | "FEATURE" | "TASK" | "IMPROVEMENT" | "OTHER";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

const typeIcons: Record<TaskType, { icon: any; color: string }> = {
  BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
  IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
  OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts: Record<TaskPriority,{ background: string; prioritycolor: string }> = {

  LOW: {
    background: "bg-red-100 dark:bg-red-950",
    prioritycolor: "text-red-600 dark:text-red-400",
  },
  MEDIUM: {
    background: "bg-blue-100 dark:bg-blue-950",
    prioritycolor: "text-blue-600 dark:text-blue-400",
  },
  HIGH: {
    background: "bg-emerald-100 dark:bg-emerald-950",
    prioritycolor: "text-emerald-600 dark:text-emerald-400",
  },
};

const ProjectTasks = ({ tasks }: { tasks: Task[] }) => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  // permission checking
  const { user } = useSelector((state: RootState) => state.auth);
  // project members
  const { currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    priority: "",
    assignee: "",
  });

  const assigneeList = useMemo(() =>
      Array.from(
        new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))
      ) as string[],
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const { status, type, priority, assignee } = filters;
      return (
        (!status || task.status === status) &&
        (!type || task.type === type) &&
        (!priority || task.priority === priority) &&
        (!assignee || task.assignee?.name === assignee)
      );
    });
  }, [filters, tasks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const isProjectAdmin = (projectId: string) => {
    const project = currentWorkspace?.projects.find(
      (p) => p.id === projectId
    );
    return project?.members?.some(
      (m: any) => m.user.id === user?.id && m.role === "admin"
    );
  };

  const canUpdateTask = (task: Task) => {
    if (task.assignee?.id === user?.id) return true;
    if (isProjectAdmin(task.projectId)) return true;
    return false;
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      toast.loading("Updating status...");
      const updatedTask = await updateTaskApi(taskId, { status: newStatus });
      dispatch(updateTask(updatedTask));

      toast.dismiss();
      toast.success("Task status updated successfully");
    } catch {
      toast.dismiss();
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting tasks...");
      await deleteTasksApi(selectedTasks);
      dispatch(deleteTask(selectedTasks));
      setSelectedTasks([]);
      toast.dismiss();
      toast.success("Tasks deleted successfully");
    } catch {
      toast.dismiss();
      toast.error("Failed to delete tasks");
    }
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((t) => t.id));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        {["status", "type", "priority", "assignee"].map((name) => {
          const options: Record<string, { label: string; value: string }[]> = {
            status: [
              { label: "All Statuses", value: "" },
              { label: "To Do", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
            ],
            type: [
              { label: "All Types", value: "" },
              { label: "Task", value: "TASK" },
              { label: "Bug", value: "BUG" },
              { label: "Feature", value: "FEATURE" },
              { label: "Improvement", value: "IMPROVEMENT" },
              { label: "Other", value: "OTHER" },
            ],
            priority: [
              { label: "All Priorities", value: "" },
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ],
            assignee: [
              { label: "All Assignees", value: "" },
              ...assigneeList.map((n) => ({ label: n, value: n })),
            ],
          };

          return (
            <select
              key={name}
              name={name}
              onChange={handleFilterChange}
              className="border not-dark:bg-white border-zinc-300 dark:border-zinc-800 outline-none px-3 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200"
            >
              {options[name].map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })}

        {selectedTasks.length > 0 && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br from-indigo-400 to-indigo-500 text-zinc-100 dark:text-zinc-200 text-sm transition-colors"
          >
            <Trash className="size-3" /> Delete
          </button>
        )}
      </div>

      <div className="overflow-auto rounded-lg lg:border border-zinc-300 dark:border-zinc-800">
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full text-sm text-left not-dark:bg-white text-zinc-900 dark:text-zinc-300">
            <thead className="text-xs uppercase dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="pl-2 pr-1">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      filteredTasks.length > 0 &&
                      selectedTasks.length === filteredTasks.length
                    }
                    className="size-3 accent-zinc-600 dark:accent-zinc-500"
                  />
                </th>
                <th className="px-4 pl-0 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Due Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => {
                const taskType = (task.type as TaskType) ?? "TASK";
                const taskPriority =
                  (task.priority as TaskPriority) ?? "MEDIUM";

                const { icon: Icon, color } = typeIcons[taskType];
                const { background, prioritycolor } =
                  priorityTexts[taskPriority];

                return (
                  <tr
                    key={task.id}
                    onClick={() =>
                      navigate(
                        `/taskDetails?projectId=${task.projectId}&taskId=${task.id}`
                      )
                    }
                    className="border-t border-zinc-300 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
                  >
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="pl-2 pr-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() =>
                          setSelectedTasks((prev) =>
                            prev.includes(task.id)
                              ? prev.filter((i) => i !== task.id)
                              : [...prev, task.id]
                          )
                        }
                        className="size-3 accent-zinc-600 dark:accent-zinc-500"
                      />
                    </td>

                    <td className="px-4 pl-0 py-2">{task.title}</td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-4 ${color}`} />
                        <span className={`uppercase text-xs ${color}`}>
                          {taskType}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}
                      >
                        {taskPriority}
                      </span>
                    </td>

                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2"
                    >
                      <select
                        value={task.status}
                        disabled={!canUpdateTask(task)}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as TaskStatus
                          )
                        }
                        className="outline-none px-2 py-1 rounded text-sm"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {task.assignee?.name || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                        <CalendarIcon className="size-4" />
                        {task.due_date
                          ? format(new Date(task.due_date), "dd MMMM")
                          : "-"}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectTasks;
