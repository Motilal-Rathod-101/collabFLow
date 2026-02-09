// import { useEffect, useState } from "react";
// import { UsersIcon, UserPlus, Activity, Shield, Search } from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../app/store";
// import InviteMemberDialog from "../components/InviteMemberDialog";
// // import userImg from "../assets/userImgCollabflow.png";

// interface TeamMember {
//   id: string;
//   role: "admin" | "member";
//   user: {
//     id: string;
//     username?: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//     image?: string;
//   };
// }

// interface Project {
//   id: string;
//   status: string;
//   tasks?: any[];
// }
// interface TeamTask {
//   id: string;
//   title: string;
//   status: string;
// }

// export default function Team() {
//   const { currentWorkspace } = useSelector(
//     (state: RootState) => state.workspace
//   );

//   const authUser = useSelector((state: RootState) => state.auth.user);

//   const [users, setUsers] = useState<TeamMember[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [tasks, setTasks] = useState<TeamTask[]>([]);

//   useEffect(() => {
//     if (!currentWorkspace) {
//       setUsers([]);
//       setTasks([]);
//       return;
//     }
    

//     const allTasks: TeamTask[] =
//       currentWorkspace.projects?.flatMap((p) =>
//         (p.tasks || []).map((t: any) => ({
//           id: t.id,
//           title: t.title,
//           status: t.status,
//         }))
//       ) || [];

//     setTasks(allTasks);
//     setUsers(currentWorkspace.members ?? []);
//   }, [currentWorkspace]);

//   const projects: Project[] = currentWorkspace?.projects || [];

//   const isAdmin = () => {
//     if (!currentWorkspace || !authUser) return false;

//     const member = currentWorkspace.members.find(
//       (m) => m.user.id === authUser.id
//     );

//     return member?.role === "admin";
//   };

//   const filteredUsers = users.filter(
//     (u) =>
//       `${u.user.first_name} ${u.user.last_name}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       u.user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start gap-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
//             Team
//           </h1>
//           <p className="text-gray-500 dark:text-zinc-400 text-sm">
//             Manage team members and their contributions
//           </p>
//         </div>

//         {isAdmin() && (
//           <button
//             onClick={() => setIsDialogOpen(true)}
//             className="flex items-center px-5 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm hover:opacity-90 transition"
//           >
//             <UserPlus className="w-4 h-4 mr-2" /> Invite Member
//           </button>
//         )}

//         <InviteMemberDialog
//           isDialogOpen={isDialogOpen}
//           setIsDialogOpen={setIsDialogOpen}
//         />
//       </div>

//       {/* Stats Cards */}
//       <div className="flex gap-4">
//         <Card
//           icon={UsersIcon}
//           label="Total Members"
//           value={users.length}
//           color="emerald"
//         />
//         <Card
//           icon={Activity}
//           label="Active Projects"
//           value={
//             projects.filter(
//               (p) => !["CANCELLED", "COMPLETED"].includes(p.status)
//             ).length
//           }
//           color="emerald"
//         />
//         <Card icon={Shield} label="Total Tasks" value={tasks.length} color="purple" />
//       </div>

//       {/* Search */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 w-4 h-4" />
//         <input
//           placeholder="Search team members..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-8 w-full py-2 rounded-md border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:border-blue-500 text-sm"
//         />
//       </div>

//       {/* Desktop Table */}
//       {filteredUsers.length === 0 ? (
//         <EmptyState users={users} />
//       ) : (
//         <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800 hidden sm:block">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
//             <thead className="bg-gray-50 dark:bg-zinc-900/50">
//               <tr>
//                 <th className="px-6 py-2.5 text-left text-sm font-medium">Name</th>
//                 <th className="px-6 py-2.5 text-left text-sm font-medium">Email</th>
//                 <th className="px-6 py-2.5 text-left text-sm font-medium">Role</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
//               {filteredUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
//                 >
//                   <td className="px-6 py-2.5 flex items-center gap-3">
//                     <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
//                       {user.user.first_name[0]}
//                     </div>

//                     <span className="text-sm text-zinc-800 dark:text-white truncate">
//                       {user.user.first_name} {user.user.last_name}
//                     </span>
//                   </td>
//                   <td className="px-6 py-2.5 text-sm text-gray-500 dark:text-zinc-400">
//                     {user.user.email}
//                   </td>
//                   <td className="px-6 py-2.5">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-md ${
//                         user.role === "admin"
//                           ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
//                           : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// const colorMap: any = {
//   emerald: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500",
//   purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-500",
// };

// // Card Component
// const Card = ({ icon: Icon, label, value, color }: any) => (
//   <div className="flex-1 p-6 rounded-lg border border-gray-300 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50">
//     <div className="flex items-center justify-between gap-8">
//       <div>
//         <p className="text-sm text-gray-500 dark:text-zinc-400">{label}</p>
//         <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
//       </div>

//       {/* <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-500/10`}> */}
//       <div className={`p-3 rounded-xl ${colorMap[color]}`}>
//         <Icon className={`w-4 h-4 text-${color}-500 dark:text-${color}-200`} />
//       </div>
//     </div>
//   </div>
// );

// // Empty State Component
// const EmptyState = ({ users }: any) => (
//   <div className="text-center py-16">
//     <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
//       <UsersIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
//     </div>
//     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//       {users.length === 0
//         ? "No team members yet"
//         : "No members match your search"}
//     </h3>
//     <p className="text-gray-500 dark:text-zinc-400">
//       {users.length === 0
//         ? "Invite team members to start collaborating"
//         : "Try adjusting your search term"}
//     </p>
//   </div>
// );
import { useEffect, useState } from "react";
import { UsersIcon, UserPlus, Activity, Shield, Search } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import InviteMemberDialog from "../components/InviteMemberDialog";

interface TeamMember {
  id: string;
  role: "admin" | "member";
  user: {
    id: string;
    username?: string;
    first_name: string;
    last_name: string;
    email: string;
    image?: string;
  };
}

interface Project {
  id: string;
  status: string;
  tasks?: any[];
}

interface TeamTask {
  id: string;
  title: string;
  status: string;
}

export default function Team() {
  const { currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );

  const authUser = useSelector((state: RootState) => state.auth.user);

  const [users, setUsers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TeamTask[]>([]);

  useEffect(() => {
    if (!currentWorkspace) {
      setUsers([]);
      setTasks([]);
      return;
    }

    const allTasks: TeamTask[] =
      currentWorkspace.projects?.flatMap((p) =>
        (p.tasks || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          status: t.status,
        }))
      ) || [];

    setTasks(allTasks);

    // IMPORTANT FIX: map WorkspaceMember -> TeamMember
    const mappedMembers: TeamMember[] =
      currentWorkspace.members?.map((m) => ({
        id: m.id,
        role: m.role,
        user: {
          id: m.user.id,
          username: m.user.username,
          email: m.user.email,
          image: m.user.image,
          first_name: m.user.first_name ?? "",
          last_name: m.user.last_name ?? "",
        },
      })) ?? [];

    setUsers(mappedMembers);
  }, [currentWorkspace]);

  const projects: Project[] = currentWorkspace?.projects || [];

  const isAdmin = () => {
    if (!currentWorkspace || !authUser) return false;

    const member = currentWorkspace.members.find(
      (m) => m.user.id === authUser.id
    );

    return member?.role === "admin";
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.user.first_name} ${u.user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Team
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage team members and their contributions
          </p>
        </div>

        {isAdmin() && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center px-5 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm hover:opacity-90 transition"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Invite Member
          </button>
        )}

        <InviteMemberDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4">
        <Card
          icon={UsersIcon}
          label="Total Members"
          value={users.length}
          color="emerald"
        />
        <Card
          icon={Activity}
          label="Active Projects"
          value={
            projects.filter(
              (p) => !["CANCELLED", "COMPLETED"].includes(p.status)
            ).length
          }
          color="emerald"
        />
        <Card
          icon={Shield}
          label="Total Tasks"
          value={tasks.length}
          color="purple"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 w-4 h-4" />
        <input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full py-2 rounded-md border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      {/* Desktop Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState users={users} />
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800 hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-2.5 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-6 py-2.5 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-6 py-2.5 text-left text-sm font-medium">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-2.5 flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                      {user.user.first_name[0]}
                    </div>

                    <span className="text-sm text-zinc-800 dark:text-white truncate">
                      {user.user.first_name} {user.user.last_name}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-sm text-gray-500 dark:text-zinc-400">
                    {user.user.email}
                  </td>
                  <td className="px-6 py-2.5">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${
                        user.role === "admin"
                          ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                          : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const colorMap: any = {
  emerald: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500",
  purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-500",
};

const Card = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex-1 p-6 rounded-lg border border-gray-300 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50">
    <div className="flex items-center justify-between gap-8">
      <div>
        <p className="text-sm text-gray-500 dark:text-zinc-400">{label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>

      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ users }: any) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
      <UsersIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {users.length === 0
        ? "No team members yet"
        : "No members match your search"}
    </h3>
    <p className="text-gray-500 dark:text-zinc-400">
      {users.length === 0
        ? "Invite team members to start collaborating"
        : "Try adjusting your search term"}
    </p>
  </div>
);
