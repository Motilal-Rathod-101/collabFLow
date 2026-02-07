import type { Workspace } from "../features/workspaceSlice";


const API = "http://localhost:8000/api/workspaces/";

import api from "./axios";

export const getWorkspaces = async () => {
 const res = await api.get<Workspace[]>("workspaces/");  return res.data;
};

export const createWorkspace = async (data: { name: string }) =>{
  const res = await api.post("workspaces/", data);
  return res.data;
}

export const deleteWorkspace = (id: string) =>
  api.delete(`workspaces/${id}/`);
