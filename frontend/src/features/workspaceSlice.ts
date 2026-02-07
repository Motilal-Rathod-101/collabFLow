import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaces } from "../api/workspaces";

/* ========= TYPES ========= */

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
}
export interface WorkspaceProject {
  id: string;
  name: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  tasks?: Task[];
}


export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type?: string;
  priority?: string;
  due_date?: string;
  assignee?: string;
  project: string;
}

export interface ProjectMember {
  id: string;
  role: "admin" | "member";
  joined_at: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";
  priority?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  workspace: string;
  tasks: Task[];
  members: ProjectMember[];
}

export interface WorkspaceMember {
  id: string;
  role: "admin" | "member";
  user: User;
}

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  owner: string;
  members: WorkspaceMember[];
  projects: Project[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
}

/* ========= STATE ========= */

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};

/* ========= THUNK ========= */

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async () => {
    return await getWorkspaces();
  }
);

/* ========= SLICE ========= */

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,

  reducers: {
    setCurrentWorkspace(state, action: PayloadAction<string>) {
      const found = state.workspaces.find(w => w.id === action.payload) || null;
      state.currentWorkspace = found;

      if (found) {
        localStorage.setItem("currentWorkspaceId", found.id);
      }
    },
    addWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspaces.push(action.payload);
    },


    addProject(state, action: PayloadAction<Project>) {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects.push(action.payload);
    },
    removeProject(state, action: PayloadAction<string>) {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.filter(
          (p) => p.id !== action.payload
        );
    },
    updateProject(state, action: PayloadAction<any>) {
      if (!state.currentWorkspace) return;

      const index = state.currentWorkspace.projects.findIndex(
        (p) => p.id === action.payload.id
      );

      if (index !== -1) {
        // IMPORTANT: replace object (new reference)
        state.currentWorkspace.projects[index] = {
          ...state.currentWorkspace.projects[index],
          ...action.payload,
        };
      }
    },


    deleteTask(state, action: PayloadAction<number[]>) {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects.forEach((project) => {
        project.tasks = project.tasks.filter(
          (t) => !action.payload.includes(t.id)
        );
      });
    },
    updateTask(state, action: PayloadAction<Task>) {
      if (!state.currentWorkspace) return;

      const project = state.currentWorkspace.projects.find(
        p => p.id === action.payload.project
      );

      if (!project) return;

      const index = project.tasks.findIndex(
        t => t.id === action.payload.id
      );

      if (index !== -1) {
        project.tasks[index] = action.payload;
      }
    },
    addTask(state, action: PayloadAction<any>) {
      if (!state.currentWorkspace) return;

      const project = state.currentWorkspace.projects.find(
        (p) => p.id === action.payload.projectId
      );

      if (!project) return;

      project.tasks = project.tasks ?? [];
      project.tasks.push(action.payload);
    },
    setProjectTasks: (state,
      action: PayloadAction<{ projectId: string; tasks: any[] }>
       ) => {
      const { projectId, tasks } = action.payload;

      const project = state.currentWorkspace?.projects.find(
        (p) => p.id === projectId
      );

      if (project) {
        project.tasks = tasks;
      }
    },

    

  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;

        const savedId = localStorage.getItem("currentWorkspaceId");

        state.currentWorkspace =
          action.payload.find(w => w.id === savedId) ||
          action.payload[0] ||
          null;
      })
      .addCase(fetchWorkspaces.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { 
  setCurrentWorkspace,
  addProject,
  addWorkspace,
  removeProject,
  updateProject,
  deleteTask,
  updateTask,
  addTask,
  setProjectTasks,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
