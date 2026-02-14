import api from "./axios";

export const signup = (data: {
  email: string;
  username: string;
  password: string;
  token?: string | null;
}) => api.post("auth/signup/", data);

export const login = (data: {
  username: string;
  password: string;
}) => api.post("auth/login/", data);

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
