import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import type { AppDispatch } from "./app/store";
import { useDispatch } from "react-redux";
import { fetchWorkspaces } from "./features/workspaceSlice";
import { useEffect } from "react";


const App = () => {

    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
        dispatch(fetchWorkspaces());
    }, [dispatch]);


    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="team" element={<Team />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projectsDetail" element={<ProjectDetails />} />
                    <Route path="taskDetails" element={<TaskDetails />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
