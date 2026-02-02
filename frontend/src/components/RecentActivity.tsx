import { useEffect, useState } from "react";
import { Clock, Square, Bug, Zap, MessageSquare, GitCommit } from "lucide-react";
import { format } from "date-fns";
import { useSelector,shallowEqual } from "react-redux";
import type { RootState } from "../app/store";

// icons nd clrs

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-500 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-500 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-500 dark:text-green-400" },
  IMPROVEMENT: { icon: MessageSquare, color: "text-amber-500 dark:text-amber-400" },
  OTHER: { icon: GitCommit, color: "text-purple-500 dark:text-purple-400" },
} as const;

const statusColors = {
  TODO: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
  IN_PROGRESS: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
  DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
} as const;

type TaskType = keyof typeof typeIcons;
type TaskStatus = keyof typeof statusColors;

// types

interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  assignee?: { name: string };
  updatedAt: string;
}

// components

export default function RecentActivity() {
const currentWorkspace = useSelector(
  (state: RootState) => state.workspace.currentWorkspace,
  shallowEqual
);


  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!currentWorkspace) {
      setTasks([]);
      return;
    }

    const allTasks: Task[] = currentWorkspace.projects.flatMap((project) =>
      project.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        type: typeIcons[task.type as TaskType] ? task.type : "OTHER",
        status: statusColors[task.status as TaskStatus] ? task.status : "TODO",
        assignee: task.assignee,
        updatedAt: task.updated_at,
      }))
    );

    setTasks(allTasks);
  }, [currentWorkspace]);

  return (
    <div className="hidden lg:block bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <h2 className="text-lg text-zinc-800 dark:text-zinc-200">
          Recent Activity
        </h2>
      </div>

      {/* Empty state */}
      {tasks.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-zinc-600 dark:text-zinc-500" />
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {tasks.map((task) => {
            const Icon = typeIcons[task.type].icon;

            return (
              <div
                key={task.id}
                className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                    <Icon
                      className={`w-4 h-4 ${typeIcons[task.type].color}`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h4 className="truncate text-zinc-800 dark:text-zinc-200">
                        {task.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded ${statusColors[task.status]}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="capitalize">
                        {task.type.toLowerCase()}
                      </span>

                      {task.assignee && (
                        <span>{task.assignee.name}</span>
                      )}

                      <span>
                        {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
