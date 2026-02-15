import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getProfile, updateProfile } from "../api/user";
import toast from "react-hot-toast";

export default function ProfileSettings() {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.dismiss();
      toast.success("Profile updated successfully");
    } catch {
      toast.dismiss();
      toast.error("Failed to update Profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700";

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Profile details</h2>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">

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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
        >
          <Save size={16}/>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </>
  );
}
