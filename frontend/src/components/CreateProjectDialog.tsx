import { useState } from "react";
import { XIcon } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import "./CreateProjectDialog.css";

import { createProject } from "../api/projects";
import { useDispatch } from "react-redux";
import { addProject } from "../features/workspaceSlice";

interface CreateProjectDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  progress: number;
}

const CreateProjectDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: CreateProjectDialogProps) => {
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
    progress: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useDispatch();

  // frontend validation aligned with django models
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "project name is required";
    }

    if (formData.name.length > 255) {
      newErrors.name = "project name cannot exceed 255 characters";
    }

    const exists = currentWorkspace?.projects?.some(
      (p) =>
        p.name.toLowerCase().trim() ===
        formData.name.toLowerCase().trim()
    );

    if (exists) {
      newErrors.name = "project with this name already exists";
    }

    const validStatus = ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"];
    if (!validStatus.includes(formData.status)) {
      newErrors.status = "invalid status selected";
    }

    const validPriority = ["LOW", "MEDIUM", "HIGH"];
    if (!validPriority.includes(formData.priority)) {
      newErrors.priority = "invalid priority selected";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      newErrors.end_date = "end date cannot be before start date";
    }

    if (
      formData.team_lead &&
      !formData.team_members.includes(formData.team_lead)
    ) {
      newErrors.team_lead =
        "team lead must be part of team members";
    }

    const uniqueMembers = new Set(formData.team_members);
    if (uniqueMembers.size !== formData.team_members.length) {
      newErrors.team_members = "duplicate members not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentWorkspace) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const project = await createProject({
        name: formData.name,
        description: formData.description,
        workspace: currentWorkspace.id,
      });

      dispatch(addProject(project));
      setIsDialogOpen(false);
    } catch (err: any) {
      setErrors({
        name:
          err?.response?.data?.name?.[0] ||
          err?.response?.data?.detail ||
          "failed to create project",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTeamMember = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((m) => m !== email),
      team_lead:
        prev.team_lead === email ? "" : prev.team_lead,
    }));
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 cpd-overlay flex items-center justify-center text-left z-50">
      <div className="cpd-dialog rounded-xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 cpd-close-btn"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-1">Create New Project</h2>

        {currentWorkspace && (
          <p className="text-sm cpd-subtitle mb-4">
            In workspace:{" "}
            <span className="cpd-workspace-name">
              {currentWorkspace.name}
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* project name */}
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter project name"
              className="w-full px-3 py-2 rounded cpd-input text-sm"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your project"
              className="w-full px-3 py-2 rounded cpd-input text-sm h-20"
            />
          </div>

          {/* status & priority */}
          <div className="grid grid-cols-2 gap-4">
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
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
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

          {/* dates */}
          <div className="grid grid-cols-2 gap-4">
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
              {errors.end_date && (
                <p className="text-red-500 text-xs">{errors.end_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                min={
                  formData.start_date
                    ? new Date(formData.start_date)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
                className="w-full px-3 py-2 rounded cpd-input text-sm"
              />
            </div>
          </div>

          {/* lead */}
          <div>
            <label className="block text-sm mb-1">Project Lead</label>

            <select
              value={formData.team_lead}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  team_lead: e.target.value,
                  team_members: e.target.value
                    ? [...new Set([...formData.team_members, e.target.value])]
                    : formData.team_members,
                })
              }
              className="w-full px-3 py-2 rounded cpd-input text-sm"
            >
              <option value="">No lead</option>

              {currentWorkspace?.members?.map((member) => (
                <option
                  key={member.user.email}
                  value={member.user.email}
                >
                  {member.user.email}
                </option>
              ))}
            </select>
          </div>

          {/* team members */}
          <div>
            <label className="block text-sm mb-1">Team Members</label>

            <select
              className="w-full px-3 py-2 rounded cpd-input text-sm"
              onChange={(e) => {
                if (
                  e.target.value &&
                  !formData.team_members.includes(e.target.value)
                ) {
                  setFormData((prev) => ({
                    ...prev,
                    team_members: [...prev.team_members, e.target.value],
                  }));
                }
              }}
            >
              <option value="">Add team members</option>

              {currentWorkspace?.members
                ?.filter(
                  (member) =>
                    !formData.team_members.includes(member.user.email)
                )
                .map((member) => (
                  <option
                    key={member.user.email}
                    value={member.user.email}
                  >
                    {member.user.email}
                  </option>
                ))}
            </select>

            {formData.team_members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.team_members.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-1 cpd-member-chip px-2 py-1 rounded-md text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(email)}
                      className="ml-1 cpd-member-remove rounded"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* footer */}
          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded cpd-btn-cancel"
            >
              Cancel
            </button>

            <button
              disabled={isSubmitting || !currentWorkspace}
              className="px-4 py-2 rounded cpd-btn-primary"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectDialog;
