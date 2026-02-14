import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  // get invite token from url
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!email || !username || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // send token if exists
      await signup({
        email,
        username,
        password,
        token,
      });

      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // google signup
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/api/auth/google/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">

        {/* header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create account
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Join CollabFlow today
          </p>
        </div>

        {/* error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* google signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-zinc-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>

        {/* divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-700" />
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            OR
          </span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-700" />
        </div>

        {/* form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>

        {/* footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-zinc-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}
