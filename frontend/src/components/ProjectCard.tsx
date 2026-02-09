import { Link } from "react-router-dom";
// import type { Project } from "../features/projectsSlice";
import { deleteProject } from "../api/projects";
import { useDispatch, useSelector } from "react-redux";
import { removeProject,Project} from "../features/workspaceSlice";
import type { RootState } from "../app/store";

const ProjectCard = ({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: (project: Project) => void;
}) => {
  const tasks = project.tasks ?? [];

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // check if current user is project admin (owner)
  const isProjectOwner = project.members?.some(
    (m) => m.user.id === user?.id && m.role === "admin"
  );

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    await deleteProject(project.id);
    dispatch(removeProject(project.id));
  };

  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onEdit(project);
  };

  return (
    <div className="relative bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-lg p-5 transition-all duration-200 group">
      
      {/* Delete Button – owner only */}
      {isProjectOwner && (
        <button 
          onClick={handleDelete}
          className="absolute top-3 right-1 text-xs text-black-500 hover:text-black-600 border-gray-200 text-black-600 bg-blue-600 rounded px-2 py-1 text-white"
        >
          Delete
        </button>
      )}

      {/* Edit Button – owner only */}
      {isProjectOwner && (
        <button
          onClick={handleEdit}
          className="absolute top-3 right-16 text-xs text-black-600 bg-blue-600 rounded px-2 py-1 items-center flex text-white gap-2 hover:text-black-700 border border-gray-500"
        >
          Edit
        </button>
      )}

      <Link to={`/projectsDetail?id=${project.id}&tab=tasks`}>
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
    </div>
  );
};

export default ProjectCard;
