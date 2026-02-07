import { useState } from "react";
import { useDispatch } from "react-redux";
import { createWorkspace } from "../api/workspaces";
import { addWorkspace, setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceDialog({ show, onClose }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);

      // backend expects object
      const workspace = await createWorkspace({ name });

      // update redux correctly
      dispatch(addWorkspace(workspace));
      dispatch(setCurrentWorkspace(workspace.id));

      setName("");
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Failed to create workspace", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
          Create Workspace
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Workspace Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Team Workspace"
              required
              className="w-full rounded border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-5 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded px-5 py-2 text-sm bg-blue-600 text-white"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
