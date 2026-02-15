// import { useEffect, useState } from "react";
// import { Save, User, Shield } from "lucide-react";
// import { getProfile, updateProfile, changePassword } from "../api/user";
// import toast from "react-hot-toast";

// export default function UserSettings() {

//   const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     username: "",
//     email: "",
//   });

//   // password form state
//   const [passwordData, setPasswordData] = useState({
//     old_password: "",
//     new_password: "",
//     confirm_password: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // load logged in user
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const data = await getProfile();

//         setFormData({
//           first_name: data.first_name || "",
//           last_name: data.last_name || "",
//           username: data.username || "",
//           email: data.email || "",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const updatedUser = await updateProfile(formData);
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       toast.dismiss();
//       toast.success("Profile updated successfully");
//     } catch {
//       toast.dismiss();
//       toast.error("Failed to update Profile");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // handle password change
//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordData.new_password !== passwordData.confirm_password) {
//       toast.error("passwords do not match");
//       return;
//     }

//     try {
//       await changePassword({
//         old_password: passwordData.old_password,
//         new_password: passwordData.new_password,
//       });

//       toast.success("password updated successfully");

//       setPasswordData({
//         old_password: "",
//         new_password: "",
//         confirm_password: "",
//       });

//     } catch {
//       toast.error("failed to update password");
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;

//   const inputClasses =
//     "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700";

//   return (
//     <div className="max-w-6xl mx-auto p-6">

//       {/* card */}
//       <div className="flex rounded-xl border overflow-hidden dark:bg-zinc-900">

//         {/* Left side bar */}
//         <div className="w-64 border-r bg-zinc-50 dark:bg-zinc-950 p-5">

//           <h2 className="text-lg font-semibold mb-1">Account</h2>
//           <p className="text-sm text-zinc-500 mb-6">
//             Manage your account info.
//           </p>

//           <div className="space-y-2">

//             <button
//               onClick={() => setActiveTab("profile")}
//               className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm
//               ${
//                 activeTab === "profile"
//                   ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
//                   : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
//               }`}
//             >
//               <User size={16} />
//               Profile
//             </button>

//             <button
//               onClick={() => setActiveTab("security")}
//               className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm
//               ${
//                 activeTab === "security"
//                   ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
//                   : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
//               }`}
//             >
//               <Shield size={16} />
//               Security
//             </button>

//           </div>

//           <div className="mt-20 text-xs text-zinc-400">
//             Secured by CollabFlow Team
//           </div>
//         </div>

//         {/*right content */}
//         <div className="flex-1 p-8">

//           {/* profile */}
//           {activeTab === "profile" && (
//             <>
//               <h2 className="text-xl font-semibold mb-6">
//                 Profile details
//               </h2>

//               <div className="flex items-center gap-4 mb-8">
//                 <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                   {formData.first_name?.charAt(0) || "U"}
//                 </div>

//                 <div>
//                   <p className="font-medium">
//                     {formData.first_name} {formData.last_name}
//                   </p>
//                   <p className="text-sm text-zinc-500">
//                     {formData.email}
//                   </p>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">

//                 <div>
//                   <label>First Name</label>
//                   <input
//                     value={formData.first_name}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         first_name: e.target.value,
//                       })
//                     }
//                     className={inputClasses}
//                   />
//                 </div>

//                 <div>
//                   <label>Last Name</label>
//                   <input
//                     value={formData.last_name}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         last_name: e.target.value,
//                       })
//                     }
//                     className={inputClasses}
//                   />
//                 </div>

//                 <div>
//                   <label>Username</label>
//                   <input
//                     value={formData.username}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         username: e.target.value,
//                       })
//                     }
//                     className={inputClasses}
//                   />
//                 </div>

//                 <div>
//                   <label>Email</label>
//                   <input
//                     value={formData.email}
//                     disabled
//                     className={inputClasses + " opacity-60"}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
//                 >
//                   <Save size={16} />
//                   {isSubmitting ? "Saving..." : "Save Changes"}
//                 </button>

//               </form>
//             </>
//           )}

//           {/* security */}
//           {activeTab === "security" && (
//             <div className="max-w-md">
//               <h2 className="text-xl font-semibold mb-6">Change Password</h2>

//               <form onSubmit={handlePasswordChange} className="space-y-4">

//                 <div>
//                   <label>Old Password</label>
//                   <input
//                     type="password"
//                     value={passwordData.old_password}
//                     onChange={(e)=>
//                       setPasswordData({...passwordData, old_password:e.target.value})
//                     }
//                     className={inputClasses}
//                   />
//                 </div>

//                 <div>
//                   <label>New Password</label>
//                   <input
//                     type="password"
//                     value={passwordData.new_password}
//                     onChange={(e)=>
//                       setPasswordData({...passwordData, new_password:e.target.value})
//                     }
//                     className={inputClasses}
//                   />
//                 </div>

//                 <div>
//                   <label>Confirm Password</label>
//                   <input
//                     type="password"
//                     value={passwordData.confirm_password}
//                     onChange={(e)=>
//                       setPasswordData({...passwordData, confirm_password:e.target.value})
//                     }
//                     className={inputClasses}
//                   />
//                 </div>

//                 <button className="bg-blue-600 text-white px-4 py-2 rounded">
//                   Update Password
//                 </button>

//               </form>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { User, Shield } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";

export default function UserSettings() {

  const [activeTab, setActiveTab] =
    useState<"profile" | "security">("profile");

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex rounded-xl border overflow-hidden dark:bg-zinc-900">

        {/* Left side bar */}
        <div className="w-64 border-r bg-zinc-50 dark:bg-zinc-950 p-5">

          <h2 className="text-lg font-semibold mb-1">Account</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Manage your account info.
          </p>

          <div className="space-y-2">

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm
              ${
                activeTab === "profile"
                  ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <User size={16}/>
              Profile
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm
              ${
                activeTab === "security"
                  ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Shield size={16}/>
              Security
            </button>

          </div>

          <div className="mt-20 text-xs text-zinc-400">
            Secured by CollabFlow Team
          </div>
        </div>

        {/* right content */}
        <div className="flex-1 p-8">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>

      </div>
    </div>
  );
}
