import api from "./axios";

// signup
export const signup = (data: {
  email: string;
  username: string;
  password: string;
}) => api.post("auth/signup/", data);

// login
export const login = (data: {
  username: string;
  password: string;
}) => api.post("auth/login/", data);

// logout
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
