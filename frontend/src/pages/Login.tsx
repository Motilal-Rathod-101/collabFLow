// src/pages/Login.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/authSlice";
import type { AppDispatch, RootState } from "../app/store";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      await dispatch(login({ username, password })).unwrap();
      navigate("/", { replace: true });
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Sign in to continue to your workspace
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Signup CTA */}
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
          >
            Create your account
          </span>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} CollabFlow. All rights reserved.
        </div>
      </div>
    </div>
  );
}