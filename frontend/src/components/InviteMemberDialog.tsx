import { useState, FormEvent } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { inviteWorkspaceMember } from "../api/workspaces";

interface InviteMemberDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

interface FormData {
  email: string;
  role: "member" | "admin";
}

const InviteMemberDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: InviteMemberDialogProps) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace?.currentWorkspace || null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    role: "member",
  });


  const validateEmail = (email:string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      if (!validateEmail(formData.email)) {
        alert("invalid email address");
        return;
      }

    e.preventDefault();
    if (!currentWorkspace) return;

    setIsSubmitting(true);

    try {
      await inviteWorkspaceMember(
        currentWorkspace.id,
        formData.email,
        formData.role
      );

      setFormData({ email: "", role: "member" });
      setIsDialogOpen(false);
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </h2>

          {currentWorkspace && (
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              Inviting to workspace:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {currentWorkspace.name}
              </span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as FormData["role"],
                })
              }
              className="w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 py-2 px-3 text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-5 py-2 rounded border text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !currentWorkspace}
              className="px-5 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberDialog;
