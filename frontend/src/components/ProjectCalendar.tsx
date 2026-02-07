import { useState } from "react";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import {
  CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Task } from "../features/workspaceSlice";

// types
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskType = "BUG" | "FEATURE" | "TASK" | "IMPROVEMENT" | "OTHER";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface UserType {
  id: string;
  name: string;
}

// ui maps
const typeColors: Record<TaskType, string> = {
  BUG: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
  FEATURE: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
  TASK: "bg-green-200 text-green-800 dark:bg-green-500 dark:text-green-900",
  IMPROVEMENT:
    "bg-purple-200 text-purple-800 dark:bg-purple-500 dark:text-purple-900",
  OTHER: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
};

const priorityBorders: Record<TaskPriority, string> = {
  LOW: "border-zinc-300 dark:border-zinc-600",
  MEDIUM: "border-amber-300 dark:border-amber-500",
  HIGH: "border-orange-300 dark:border-orange-500",
};

interface ProjectCalendarProps {
  tasks: Task[];
}

const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const today = new Date();

  const getDate = (value?: string | Date): Date | null => {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
  };

  const getTasksForDate = (date: Date) =>
    tasks.filter((task) => {
      const d = getDate(task.due_date);
      return d ? isSameDay(d, date) : false;
    });

  const upcomingTasks = tasks
    .filter((task) => {
      const d = getDate(task.due_date);
      return d && !isBefore(d, today) && task.status !== "DONE";
    })
    .sort(
      (a, b) =>
        getDate(a.due_date)!.getTime() -
        getDate(b.due_date)!.getTime()
    )
    .slice(0, 5);

  const overdueTasks = tasks.filter((task) => {
    const d = getDate(task.due_date);
    return d && isBefore(d, today) && task.status !== "DONE";
  });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleMonthChange = (direction: "next" | "prev") => {
    setCurrentMonth((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-900 dark:text-white text-md flex gap-2 items-center max-sm:hidden">
              <CalendarIcon className="size-5" /> Task Calendar
            </h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => handleMonthChange("prev")}>
                <ChevronLeft className="size-5 text-zinc-600 dark:text-zinc-400" />
              </button>
              <span className="text-zinc-900 dark:text-white">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button onClick={() => handleMonthChange("next")}>
                <ChevronRight className="size-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-xs text-zinc-600 dark:text-zinc-400 mb-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const hasOverdue = dayTasks.some((t) => {
                const d = getDate(t.due_date);
                return d && isBefore(d, today) && t.status !== "DONE";
              });

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`sm:h-14 rounded-md flex flex-col items-center justify-center text-sm
                    ${
                      isSelected
                        ? "bg-blue-200 text-blue-900 dark:bg-blue-600 dark:text-white"
                        : "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300"
                    }
                    ${hasOverdue ? "border border-red-300 dark:border-red-500" : ""}`}
                >
                  <span>{format(day, "d")}</span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-blue-700 dark:text-blue-400">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
          <h3 className="text-sm flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" /> Upcoming Tasks
          </h3>

          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-center text-zinc-500">
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => {
                const d = getDate(task.due_date)!;
                const taskType: TaskType = (task.type as TaskType) ?? "TASK";

                return (
                  <div key={task.id} className="p-3 rounded bg-zinc-50">
                    <div className="flex justify-between">
                      <span>{task.title}</span>
                      <span className={`text-xs px-2 ${typeColors[taskType]}`}>
                        {taskType}
                      </span>
                    </div>
                    <p className="text-xs">{format(d, "MMM d")}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {overdueTasks.length > 0 && (
          <div className="border border-red-300 rounded-lg p-4">
            <h3 className="text-red-600 text-sm mb-3">
              Overdue Tasks ({overdueTasks.length})
            </h3>
            {overdueTasks.map((task) => {
              const d = getDate(task.due_date)!;
              return (
                <div key={task.id} className="p-3 rounded bg-red-50">
                  <span>{task.title}</span>
                  <p className="text-xs">Due {format(d, "MMM d")}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCalendar;
