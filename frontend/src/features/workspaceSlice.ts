import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaces } from "../api/workspaces";


// types

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
}


export interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  projectId: string;              
  type?: string;
  priority?: string;
  due_date?: string | Date;
  assignee?: any;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  tasks?: Task[];
}


export interface WorkspaceMember {
  id: string;
  role: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image?: string;
  };
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  settings: {};
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  image_url: any;
  members: WorkspaceMember[];
  projects: WorkspaceProject[];
  owner: User;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
}

// state init

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};



export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async () => {
    const data = await getWorkspaces();
    return data as Workspace[];
  }
);

// slice

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,

  reducers: {
    setWorkspaces(state, action: PayloadAction<Workspace[]>) {
      state.workspaces = action.payload;
      state.currentWorkspace = action.payload[0] ?? null;
    },

    setCurrentWorkspace(state, action: PayloadAction<string>) {
      localStorage.setItem("currentWorkspaceId", action.payload);
      const ws = state.workspaces.find(w => w.id === action.payload);
      if (ws) state.currentWorkspace = ws;
    },

    addWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspaces.push(action.payload);
      state.currentWorkspace = action.payload;
    },

    updateWorkspace(state, action: PayloadAction<Workspace>) {
      const index = state.workspaces.findIndex(
        w => w.id === action.payload.id
      );
      if (index !== -1) state.workspaces[index] = action.payload;

      if (state.currentWorkspace?.id === action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },

    deleteWorkspace(state, action: PayloadAction<string>) {
      state.workspaces = state.workspaces.filter(
        w => w.id !== action.payload
      );
      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = null;
      }
    },

    addProject(state, action: PayloadAction<WorkspaceProject>) {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects.push(action.payload);
    },

    addTask(state, action: PayloadAction<Task>) {
      if (!state.currentWorkspace) return;

      const project = state.currentWorkspace.projects.find(
        p => p.id === action.payload.projectId
      );

      if (!project) return;

      if (!project.tasks) {
        project.tasks = [];//init
      }

      project.tasks.push(action.payload);
    },

    updateTask(state, action: PayloadAction<Task>) {
      if (!state.currentWorkspace) return;

      const project = state.currentWorkspace.projects.find(
        p => p.id === action.payload.projectId
      );

      if (!project || !project.tasks) return;

      const index = project.tasks.findIndex(
        t => t.id === action.payload.id
      );

      if (index !== -1) {
        project.tasks[index] = action.payload;
      }
    },


    deleteTask(state, action: PayloadAction<string[]>) {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects.forEach(project => {
        if (!project.tasks) return;     //

        project.tasks = project.tasks.filter(
          t => !action.payload.includes(t.id)
        );
      });
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

  const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");

  if (savedWorkspaceId) {
    const found = action.payload.find(
      (w) => w.id === savedWorkspaceId
    );
    state.currentWorkspace = found ?? action.payload[0] ?? null;
  } else {
    state.currentWorkspace = action.payload[0] ?? null;
  }
})

      .addCase(fetchWorkspaces.rejected, (state) => {
        state.loading = false;
      });
  },
});

// exports


export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  addTask,
  updateTask,
  deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
