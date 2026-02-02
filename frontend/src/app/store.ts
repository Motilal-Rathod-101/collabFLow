import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "../features/workspaceSlice";
import themeReducer from '../features/themeSlice'
import projectsReducer from "../features/projectsSlice";


export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
     projects: projectsReducer,
        theme: themeReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
