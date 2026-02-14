import { Plus } from "lucide-react";
import { useState } from "react";
import AddProjectMember from "./AddProjectMember";
import EditProjectDialog from "./EditProjectDialog";
import { Project } from "../features/workspaceSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface Props {
  project: Project;
}

export default function ProjectSettings({ project }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  // find admin / owner
  const projectOwner =
    project.members?.find((m) => m.role === "admin")?.user;

  // check owner
  const isProjectOwner =
    currentUser && projectOwner
      ? currentUser.id === projectOwner.id
      : false;

  // open edit dialog
  const handleEdit = () => {
    setIsEditOpen(true);
  };

  // progress tracking from tasks
  const tasks = project.tasks ?? [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm bg-gray-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300 cursor-not-allowed";

  const cardClasses =
    "relative rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

  const labelClasses =
    "text-sm text-zinc-600 dark:text-zinc-400";

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      {/* edit dialog */}
      <EditProjectDialog
        isDialogOpen={isEditOpen}
        setIsDialogOpen={setIsEditOpen}
        project={project}
      />

      {/* project details */}
      <div className={cardClasses}>

        {isProjectOwner && (
          <button
            onClick={handleEdit}
            className="absolute top-3 right-3 text-xs bg-blue-600 rounded px-2 py-1 flex text-white gap-2 border border-gray-500"
          >
            Edit
          </button>
        )}

        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
          Project Details
        </h2>

        <div className="space-y-4">

          <div>
            <label className={labelClasses}>Project Name</label>
            <input
              value={project.name || ""}
              readOnly
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Project Owner</label>
            <input
              value={
                projectOwner
                  ? `${projectOwner.first_name || ""} ${projectOwner.last_name || ""}`.trim() ||
                    projectOwner.email
                  : ""
              }
              readOnly
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              value={project.description ?? ""}
              readOnly
              className={`${inputClasses} h-24`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Status</label>
              <input
                value={project.status}
                readOnly
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Priority</label>
              <input
                value={project.priority ?? "MEDIUM"}
                readOnly
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Start Date</label>
              <input
                value={project.start_date ?? ""}
                readOnly
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>End Date</label>
              <input
                value={project.end_date ?? ""}
                readOnly
                className={inputClasses}
              />
            </div>
          </div>

          {/* progress tracking */}
          <div>
            <label className={labelClasses}>Progress</label>

            <input
              value={`${progress}%`}
              readOnly
              className={inputClasses}
            />

            <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded mt-2">
              <div
                className="h-2 rounded bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-xs text-zinc-500 mt-1">
              {doneTasks} / {totalTasks} tasks completed
            </div>
          </div>

        </div>
      </div>

      {/* team members */}
      <div className="space-y-6">
        <div className={cardClasses}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
              Team Members{" "}
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                ({project.members.length})
              </span>
            </h2>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
            </button>

            <AddProjectMember
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>

          {project.members.length > 0 && (
            <div className="space-y-2 mt-3">
              {project.members.map((member) => (
                <div
                  key={member.user.id}
                  className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm"
                >
                  <span>{member.user.email}</span>

                  {project.team_lead === member.user.id && (
                    <span className="px-2 py-0.5 rounded-xs ring ring-zinc-200 dark:ring-zinc-600">
                      Team Lead
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
