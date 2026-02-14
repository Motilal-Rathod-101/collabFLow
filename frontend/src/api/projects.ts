import api from "./axios";''

export const getProjects = async () => {
  const res = await api.get("projects/");
  return res.data;
};

// create
export const createProject = async (data: any) => {
  const res = await api.post("projects/", data);
  return res.data;
};

// update
export const updateProjectApi = async (id: string, data: any) => {
  const res = await api.put(`projects/${id}/`, data);
  return res.data;
};

// delete
export const deleteProject = async (id: string) => {
  await api.delete(`projects/${id}/`);
};

export const getProjectMembers = async (projectId: string) => {
  const res = await api.get(`/projects/${projectId}/members/`);
  return res.data;
};

// assing project to member
export const addProjectMember = async (
  projectId: string,
  userId: string
) => {
  const res = await api.post(`projects/${projectId}/members/add/`, {
    user: userId,
  });
  return res.data;
};