import api from "./axios";

// get profile
export const getProfile = async () => {
  const res = await api.get("auth/user/profile/");
  return res.data;
};

// update profile
export const updateProfile = async (data: {
  first_name?: string;
  last_name?: string;
  username?: string;
}) => {
  const res = await api.put("auth/user/profile/", data);
  return res.data;
};
