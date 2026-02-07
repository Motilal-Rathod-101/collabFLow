import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getProjects } from "../api/projects";


// types


export type ProjectStatus ="PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";


export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Project {
  id: string;
  name: string;
  description?: string;

  status: ProjectStatus;
  priority?: ProjectPriority;

  start_date?: string;
  end_date?: string;
  created_at?: string;

  workspace: string;
  tasks?: any[];

  members?: {
    id: string;
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      image?: string;
    };
    role: "admin" | "member";
  }[];

  //  members?: ProjectMember[];   // ✅ ADD
  team_lead?: string; 
  progress?: number;
}


interface ProjectState {
  projects: Project[];
  loading: boolean;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
};

// thunk
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const data = await getProjects();
    return data as Project[];
  }
);

// slice
const projectSlice = createSlice({
  name: "projects",
  initialState,

  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      });
  },
});


export const { setProjects } = projectSlice.actions;
export default projectSlice.reducer;
