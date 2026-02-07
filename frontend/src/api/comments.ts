import api from "./axios";

// get  comments tasks
export const getCommentsByTask = async (taskId: string) => {
  const res = await api.get(`comments/?task=${taskId}`);
  return res.data;
};

// post new comment
export const addComment = async (taskId: string, content: string) => {
  const res = await api.post("comments/", {
    task: taskId,
    content: content,
  });
  return res.data;
};
