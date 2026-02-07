import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./app/store";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import { fetchWorkspaces } from "./features/workspaceSlice";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // after user login loads the data 
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWorkspaces());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Toaster />

      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projectsDetail" element={<ProjectDetails />} />
            <Route path="/taskDetails" element={<TaskDetails />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
