import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addProjectMember } from "../api/projects";

interface AddProjectMemberProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProjectMember = ({
  isDialogOpen,
  setIsDialogOpen,
}: AddProjectMemberProps) => {

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  const currentWorkspace = useSelector(
    (state: any) => state.workspace?.currentWorkspace || null
  );

  const project = currentWorkspace?.projects.find(
    (p: any) => p.id === projectId
  );

  const projectMembersEmails =
    project?.members.map((member: any) => member.user.email) || [];

  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // add member logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !projectId) return;

    try {
      setIsAdding(true);

      // find selected workspace member
      const selectedMember = currentWorkspace.members.find(
        (m: any) => m.user.email === email
      );

      if (!selectedMember) {
        alert("user not found");
        return;
      }

      // api call
      await addProjectMember(projectId, selectedMember.user.id);

      // close dialog
      setIsDialogOpen(false);

      // quick refresh (simple for submission)
      window.location.reload();

    } catch (err: any) {
      alert(err?.response?.data?.detail || "failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-xl text-zinc-900 dark:text-zinc-200">

        {/* header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Add Member to Project
          </h2>

          {currentWorkspace && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Adding to Project:
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {" "} {project?.name}
              </span>
            </p>
          )}
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

              <select
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a member</option>

                {currentWorkspace?.members
                  ?.filter(
                    (member: any) =>
                      !projectMembersEmails.includes(member.user.email)
                  )
                  .map((member: any) => (
                    <option
                      key={member.user.id}
                      value={member.user.email}
                    >
                      {member.user.email}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-5 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isAdding || !currentWorkspace}
              className="px-5 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
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
