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
