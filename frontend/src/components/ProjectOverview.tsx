import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  members?: { email: string }[];
  end_date?: string;
  progress?: number;
}

interface Props {
  openDialog: () => void; // from Dashboard
}

const statusColors: Record<string, string> = {
  PLANNING: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
  ACTIVE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
  COMPLETED: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
  CANCELLED: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
};

const priorityColors: Record<string, string> = {
  LOW: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400",
  MEDIUM: "border-amber-300 text-amber-700 dark:border-amber-500 dark:text-amber-400",
  HIGH: "border-green-300 text-green-700 dark:border-green-500 dark:text-green-400",
};

export default function ProjectOverview({ openDialog }: Props) {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(currentWorkspace?.projects || []);
  }, [currentWorkspace]);

  if (!currentWorkspace) return null;

  return (
    <div className="hidden lg:block bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-md text-zinc-800 dark:text-zinc-300">Project Overview</h2>
        <Link to="/projects" className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center">
          View all <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {/* Projects */}
      <div>
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <FolderOpen size={32} className="text-zinc-600 dark:text-zinc-500" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">No projects yet</p>
            <button
              onClick={openDialog}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:opacity-90"
            >
              Create your First Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                to={`/projectsDetail?id=${project.id}&tab=tasks`}
                className="block p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                {/* Project Info */}
                <div className="flex justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${statusColors[project.status]}`}
                    >
                      {project.status}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full border-2 ${priorityColors[project.priority]}`}
                    />
                  </div>
                </div>

                {/* Members & Date */}
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  <div className="flex items-center gap-4">
                    {project.members?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-3 h-3" />
                        {project.members.length} members
                      </div>
                    )}
                    {project.end_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(project.end_date), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                    <span className="text-zinc-600 dark:text-zinc-400">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded h-1.5">
                    <div
                      className="h-1.5 bg-blue-500 rounded"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
