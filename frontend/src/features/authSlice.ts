import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginApi } from "../api/auth";
import { jwtDecode } from "jwt-decode";

type LoginPayload = {
  username: string;
  password: string;
};

export interface User {
  id: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
};

const getUserFromToken = (): User | null => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return { id: decoded.user_id };
  } catch {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromToken(),
  loading: false,
  isAuthenticated: !!localStorage.getItem("access"),
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload) => {
    const res = await loginApi(data);

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    return res.data.access;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        const decoded: any = jwtDecode(action.payload);
        state.user = { id: decoded.user_id };
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
