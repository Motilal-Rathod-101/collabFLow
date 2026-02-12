import api from "./axios";

// fetch
export const getTasks = async (projectId: string) => {
  const res = await api.get(`/projects/${projectId}/tasks/`);
  return res.data;
};

// create
export const createTaskApi = async (projectId: string,payload: any) => {
  const res = await api.post(`/projects/${projectId}/tasks/`,payload);
  return res.data;
};

export const updateTaskApi = async (taskId: string, payload: any) => {
  const res = await api.put(`/tasks/${taskId}/`, payload);
  return res.data;
};




export const deleteTasksApi = (taskIds: string[]) => {
  return api.post(`/tasks/bulk-delete/`, { ids: taskIds });
};
