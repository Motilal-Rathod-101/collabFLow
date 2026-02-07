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

// update
export const updateTaskApi = (taskId: number, payload: any) => {
  return api.put(`/tasks/${taskId}/`, payload);
};


// delete
export const deleteTasksApi = (taskIds: number[]) => {
  return api.post(`/tasks/bulk-delete/`, { ids: taskIds });
};
