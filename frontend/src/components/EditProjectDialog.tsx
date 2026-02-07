import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

import type { RootState } from "../app/store";
import "./CreateProjectDialog.css";

import { updateProjectApi } from "../api/projects";
import { updateProject } from "../features/workspaceSlice";
import type { Project } from "../features/projectsSlice";

interface EditProjectDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project | null;
}

interface FormData {
  name: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  team_members: string[];
  team_lead: string;
}

const EditProjectDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  project,
}: EditProjectDialogProps) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    start_date: "",
    end_date: "",
    team_members: [],
    team_lead: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // fill form when dialog opens
  useEffect(() => {
    if (!isDialogOpen || !project) return;

    setFormData({
      name: project.name ?? "",
      description: project.description ?? "",
      status: project.status ?? "PLANNING",
      priority: project.priority ?? "MEDIUM",
      start_date: project.start_date ?? "",
      end_date: project.end_date ?? "",
      team_members: project.members?.map(m => m.user.id) ?? [],
      team_lead: project.team_lead ?? "",
    });
  }, [isDialogOpen, project?.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentWorkspace || !project) return;

    setIsSubmitting(true);

    try {
      const res = await updateProjectApi(project.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        start_date: formData.start_date,
        end_date: formData.end_date,
        team_lead: formData.team_lead,
        team_members: formData.team_members,
      });

      // dispatch(updateProject(res.data));
      dispatch(updateProject({...res.data}));
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Project update failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDialogOpen || !project) return null;

  return (
    <div className="fixed inset-0 cpd-overlay flex items-center justify-center z-50">
      <div className="cpd-dialog rounded-xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 cpd-close-btn"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-3">Edit Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 rounded cpd-input text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 rounded cpd-input text-sm h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 rounded cpd-input text-sm"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 rounded cpd-input text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-3 py-2 rounded cpd-input text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-3 py-2 rounded cpd-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Team Lead</label>
            <select
              value={formData.team_lead}
              onChange={(e) =>
                setFormData({ ...formData, team_lead: e.target.value })
              }
              className="w-full px-3 py-2 rounded cpd-input text-sm"
            >
              <option value="">Select Team Lead</option>
              {currentWorkspace?.members?.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.first_name} {m.user.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded cpd-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded cpd-btn-primary"
            >
              {isSubmitting ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectDialog;
