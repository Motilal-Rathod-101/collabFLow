import { Link } from "react-router-dom";
import type { Project } from "../features/projectsSlice";

const ProjectCard = ({ project }: { project: Project }) => {
  const tasks = project.tasks ?? [];

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(
    (t) => t.status === "DONE"
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return (
    <Link
      to={`/projectsDetail?id=${project.id}&tab=tasks`}
      className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-lg p-5 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-zinc-200 mb-1 truncate group-hover:text-blue-500">
          {project.name}
        </h3>
        <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-2">
          {project.description || "No description"}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-zinc-400">
        <span>{totalTasks} tasks</span>
        <span>{doneTasks} done</span>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded">
          <div
            className="h-1.5 rounded bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
