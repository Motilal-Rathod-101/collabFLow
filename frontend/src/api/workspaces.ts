const API = "http://localhost:8000/api";

export async function fetchWorkspaces() {
  const res = await fetch(`${API}/workspaces/`);

  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return res.json();
}
