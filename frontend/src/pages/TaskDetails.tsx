import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon } from "lucide-react";
import { getCommentsByTask, addComment } from "../api/comments";




//type

interface User {
  id: string | number;
  first_name?: string;
  last_name?: string;
  image?: string;
}

interface Comment {
  id: string | number;
  content: string;
  createdAt: string;
  user: {
    id: string | number;
    name: string;
    image?: string;
  };
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  type?: string;
  priority?: string;
  due_date?: string;
  assignee?: {
    id: string | number;
    name: string;
    image?: string;
  } | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  priority?: string;
  progress?: number;
  start_date?: string;
  tasks: Task[];
}

// components

const TaskDetails = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const taskId = searchParams.get("taskId");

  const { currentWorkspace } = useSelector((state: any) => state.workspace);

  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // fetching tasks

useEffect(() => {
  if (!currentWorkspace || !projectId || !taskId) return;

  setLoading(true);

  const proj = currentWorkspace.projects.find(
    (p: Project) => String(p.id) === projectId
  );
  if (!proj) {
    setLoading(false);
    return;
  }

  const tsk = proj.tasks.find(
    (t: Task) => String(t.id) === taskId
  );
  if (!tsk) {
    setLoading(false);
    return;
  }

  setProject(proj);
  setTask(tsk);
  setLoading(false);
}, [currentWorkspace, projectId, taskId]);


  // comments

  const fetchComments = async () => {
  if (!taskId) return;

  const data = await getCommentsByTask(taskId);

  const formatted = data.map((c: any) => ({
    id: c.id,
    content: c.content,
    createdAt: c.created_at,
    user: {
      id: c.user.id,
      name: `${c.user.first_name} ${c.user.last_name}`,
      image: c.user.image,
    },
  }));

  setComments(formatted);
};


  useEffect(() => {
    fetchComments();
  }, [taskId]);

  // adding comments
const handleAddComment = async () => {
  if (!newComment.trim() || !taskId) return;

  try {
    toast.loading("Adding comment...");

    const c = await addComment(taskId, newComment);

    setComments((prev) => [
      ...prev,
      {
        id: c.id,
        content: c.content,
        createdAt: c.created_at,
        user: {
          id: c.user.id,
          name: `${c.user.first_name} ${c.user.last_name}`,
          image: c.user.image,
        },
      },
    ]);

    setNewComment("");
    toast.dismiss();
    toast.success("Comment added");
  } catch {
    toast.dismiss();
    toast.error("Failed to add comment");
  }
};


  // UI

  if (loading)
    return (
      <div className="px-4 py-6 text-gray-500 dark:text-zinc-400">
        Loading task details...
      </div>
    );

  if (!task)
    return (
      <div className="px-4 py-6 text-red-500">
        Task not found
      </div>
    );



  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 max-w-6xl mx-auto">
      {/* COMMENTS */}
      <div className="w-full lg:w-2/3">
        <div className="p-5 border rounded-md dark:border-zinc-800 flex flex-col lg:h-[80vh]">
          <h2 className="flex items-center gap-2 mb-4 font-semibold">
            <MessageCircle className="size-5" />
            Task Discussion ({comments.length})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {comments.length === 0 && (
              <p className="text-sm text-gray-500">
                No comments yet.
              </p>
            )}

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border p-3 rounded-md dark:border-zinc-700"
              >
                <div className="text-xs text-gray-500 mb-1">
                  {comment.user.name} •{" "}
                  {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="border rounded p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="self-end bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* TASK + PROJECT INFO */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="p-5 border rounded-md dark:border-zinc-800">
          <h1 className="text-lg font-semibold mb-2">{task.title}</h1>

          <div className="flex gap-2 mb-3 text-xs">
            <span className="px-2 py-0.5 bg-zinc-200 rounded">
              {task.status}
            </span>
            <span className="px-2 py-0.5 bg-blue-200 rounded">
              {task.type}
            </span>
            <span className="px-2 py-0.5 bg-green-200 rounded">
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-4">
              {task.description}
            </p>
          )}

          <div className="text-sm space-y-2">
            <div>
              Assigned to: {task.assignee?.name || "Unassigned"}
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              Due:{" "}
              {task.due_date
                ? format(new Date(task.due_date), "dd MMM yyyy")
                : "N/A"}
            </div>
          </div>
        </div>

        {project && (
          <div className="p-5 border rounded-md dark:border-zinc-800">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <PenIcon className="size-4" />
              {project.name}
            </h2>
            <p className="text-sm">
              Status: {project.status}
            </p>
            <p className="text-sm">
              Progress: {project.progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
