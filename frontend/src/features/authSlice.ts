import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login as loginApi } from "../api/auth";

// type
type LoginPayload = {
  username: string;
  password: string;
};

export interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}


const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: !!localStorage.getItem("access"),
};

// thunk
export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload) => {
    const res = await loginApi(data);

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    return res.data; 
  }
);

// slice
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

      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
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
