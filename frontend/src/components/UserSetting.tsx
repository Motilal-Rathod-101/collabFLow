import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getProfile, updateProfile } from "../api/user";

export default function UserSettings() {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // load logged in user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getProfile();

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updatedUser = await updateProfile(formData);

            localStorage.setItem("user", JSON.stringify(updatedUser));
            alert("profile updated successfully");
        } catch {
            alert("update failed");
        } finally {
            setIsSubmitting(false);
        }
    };


  if (loading) return <div className="p-6">Loading...</div>;

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-lg border p-6 dark:bg-zinc-900">

        <h2 className="text-lg font-medium mb-6">
          User Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label>First Name</label>
            <input
              value={formData.first_name}
              onChange={(e)=>
                setFormData({...formData, first_name:e.target.value})
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              value={formData.last_name}
              onChange={(e)=>
                setFormData({...formData, last_name:e.target.value})
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label>Username</label>
            <input
              value={formData.username}
              onChange={(e)=>
                setFormData({...formData, username:e.target.value})
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              value={formData.email}
              disabled
              className={inputClasses + " opacity-60"}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Save size={16}/>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}
