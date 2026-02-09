import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaces } from "../api/workspaces";

export interface User {
  id: string;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image?: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  email?: string; 
}

export interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type?: string;
  priority?: string;
  due_date?: string;
  assignee?: TaskAssignee | null;
  project: string;
  projectId?: string;
}

export interface ProjectMember {
  id: string;
  role: "admin" | "member";
  joined_at: string;
  user: User;
}

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  start_date?: string;
  end_date?: string;
  created_at: string;
  workspace: string;
  progress?: number;
  tasks: Task[];
  members: ProjectMember[];
  priority?: ProjectPriority;
  team_lead?: string;

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
  owner: User;
  members: WorkspaceMember[];
  projects: Project[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async () => {
    return await getWorkspaces();
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,

  reducers: {
    setCurrentWorkspace(state, action: PayloadAction<string>) {
      const found = state.workspaces.find(
        (w) => w.id === action.payload
      ) || null;

      state.currentWorkspace = found;

      if (found) {
        localStorage.setItem("currentWorkspaceId", found.id);
      }
    },

    addWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspaces.push(action.payload);
    },

    removeWorkspace(state, action: PayloadAction<string>) {
      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );

      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = state.workspaces[0] || null;

        if (state.currentWorkspace) {
          localStorage.setItem(
            "currentWorkspaceId",
            state.currentWorkspace.id
          );
        } else {
          localStorage.removeItem("currentWorkspaceId");
        }
      }
    },

    addProject(state, action: PayloadAction<Project>) {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects.push(action.payload);
    },

    removeProject(state, action: PayloadAction<string>) {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects = state.currentWorkspace.projects.filter(
        (p) => p.id !== action.payload
      );
    },

    updateProject(state, action: PayloadAction<Project>) {
      if (!state.currentWorkspace) return;

      const index = state.currentWorkspace.projects.findIndex(
        (p) => p.id === action.payload.id
      );

      if (index !== -1) {
        state.currentWorkspace.projects[index] = action.payload;
      }
    },

    deleteTask(state, action: PayloadAction<string[]>) {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects.forEach((project) => {
        project.tasks = project.tasks.filter(
          (t) => !action.payload.includes(t.id)
        );
      });
    },
      updateTask(state, action: PayloadAction<any>) {
        if (!state.currentWorkspace) return;

        const projectId =
          action.payload.project || action.payload.projectId;

        const project = state.currentWorkspace.projects.find(
          (p) => p.id === projectId
        );

        if (!project || !project.tasks) return;

        const index = project.tasks.findIndex(
          (t) => String(t.id) === String(action.payload.id)
        );

        if (index !== -1) {
          project.tasks[index] = {
            ...project.tasks[index],
            ...action.payload,
          };
        }
      },

    setProjectTasks(
      state,
      action: PayloadAction<{ projectId: string; tasks: Task[] }>
    ) {
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
          action.payload.find((w) => w.id === savedId) ||
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
  addWorkspace,
  removeWorkspace,
  addProject,
  removeProject,
  updateProject,
  deleteTask,
  updateTask,
  setProjectTasks,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
