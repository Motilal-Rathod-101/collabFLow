import { useState } from "react";
import { changePassword } from "../api/user";
import toast from "react-hot-toast";

export default function SecuritySettings() {

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("passwords do not match");
      return;
    }

    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });

      toast.success("password updated successfully");

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch {
      toast.error("failed to update password");
    }
  };

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700";

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>

      <form onSubmit={handlePasswordChange} className="space-y-4">

        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={passwordData.old_password}
            onChange={(e)=>
              setPasswordData({...passwordData, old_password:e.target.value})
            }
            className={inputClasses}
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={passwordData.new_password}
            onChange={(e)=>
              setPasswordData({...passwordData, new_password:e.target.value})
            }
            className={inputClasses}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={passwordData.confirm_password}
            onChange={(e)=>
              setPasswordData({...passwordData, confirm_password:e.target.value})
            }
            className={inputClasses}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Password
        </button>

      </form>
    </div>
  );
}
