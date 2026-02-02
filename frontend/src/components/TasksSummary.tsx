import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface Task {
  id: number;
  title: string;
  status: string;
  type: string;
  priority: string;
  assignee?: string;
  due_date?: string;
}


interface SummaryCard {
  title: string;
  count: number;
  icon: React.FC<any>;
  color: string;
  items: Task[];
}

export default function TasksSummary() {

  const currentWorkspace = useSelector(
  (state: RootState) => state.workspace.currentWorkspace
);


// const projects = currentWorkspace?.projects ?? [];
// if (!currentWorkspace) {
//   return null;
// }

const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  if (!currentWorkspace) {
    setTasks([]);
    return;
  }

const allTasks: Task[] =
  currentWorkspace.projects.flatMap((p) =>
    (p.tasks || []).map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      type: t.type,
      priority: t.priority,
      assignee: t.assignee,
      due_date: t.due_date,
    }))
  );


    setTasks(allTasks);
}, [currentWorkspace]);

const userId = "fcc29be7-ae99-4fb7-849f-25627585dd99"; // logged in user id

const myTasks = tasks.filter((t) => t.assignee === userId);

const overdueTasks = tasks.filter(
  (t) =>
    t.due_date &&
    new Date(t.due_date) < new Date() &&
    t.status !== "DONE"
);

const inProgressTasks = tasks.filter(
  (t) => t.status === "IN_PROGRESS"
);


  // summaryCards
  const summaryCards: SummaryCard[] = [
    {
      title: "My Tasks",
      count: myTasks.length,
      icon: User,
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
      items: myTasks.slice(0, 3),
    },
    {
      title: "Overdue",
      count: overdueTasks.length,
      icon: AlertTriangle,
      color:
        "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
      items: overdueTasks.slice(0, 3),
    },
    {
      title: "In Progress",
      count: inProgressTasks.length,
      icon: Clock,
      color:
        "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
      items: inProgressTasks.slice(0, 3),
    },
  ];

  return (
    <div className="hidden lg:block space-y-6">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <card.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-800 dark:text-white">
                {card.title}
              </h3>
            </div>
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${card.color}`}
            >
              {card.count}
            </span>
          </div>

          {/* Task List */}
          <div className="p-4">
            {card.items.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
                No {card.title.toLowerCase()}
              </p>
            ) : (
              <div className="space-y-3">
                {card.items.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-zinc-800 dark:text-white truncate">
                      {task.title}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 capitalize mt-1">
                      {task.type} • {task.priority} priority
                    </p>
                  </div>
                ))}

                {card.count > 3 && (
                  <button className="flex items-center justify-center w-full text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white mt-2">
                    View {card.count - 3} more
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
