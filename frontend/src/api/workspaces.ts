import type { Workspace } from "../features/workspaceSlice";
import api from "./axios";

const API = "http://localhost:8000/api/workspaces/";

export const getWorkspaces = async () => {
  const res = await api.get<Workspace[]>("workspaces/");
  return res.data;
};

export const createWorkspace = async (data: { name: string }) => {
  const res = await api.post("workspaces/", data);
  return res.data;
};

export const deleteWorkspace = (id: string) => api.delete(`workspaces/${id}/`);

// invitation
export const inviteWorkspaceMember = (workspaceId: string,email: string,
role: "admin" | "member"
) => api.post(`workspaces/${workspaceId}/invite/`, { email, role });
