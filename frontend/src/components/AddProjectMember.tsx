import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

interface AddProjectMemberProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }: AddProjectMemberProps) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);

  const project = currentWorkspace?.projects.find((p: any) => p.id === id);
  const projectMembersEmails = project?.members.map((member: any) => member.user.email) || [];

  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 apm-overlay flex items-center justify-center z-50">
      <div className="apm-dialog rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="size-5" /> Add Member to Project
          </h2>
          {currentWorkspace && (
            <p className="text-sm apm-subtitle">
              Adding to Project: <span className="apm-project-name">{project?.name}</span>
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 apm-input-icon" />
              <select
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="apm-select pl-10 mt-1 w-full text-sm py-2 focus:outline-none"
                required
              >
                <option value="">Select a member</option>
                {currentWorkspace?.members
                  ?.filter((member: any) => !projectMembersEmails.includes(member.user.email))
                  .map((member: any) => (
                    <option key={member.user.id} value={member.user.email}>
                      {member.user.email}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="apm-btn apm-btn-cancel px-5 py-2 text-sm rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding || !currentWorkspace}
              className="apm-btn apm-btn-primary px-5 py-2 text-sm rounded transition"
            >
              {isAdding ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectMember;
