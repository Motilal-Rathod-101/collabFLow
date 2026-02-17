import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-500">Page Not Found</p>

      <Link
        to="/"
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Go Home
      </Link>
    </div>
  );
}
