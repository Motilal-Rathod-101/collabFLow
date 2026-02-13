import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchWorkspaces } from "../features/workspaceSlice";

import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";


const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const { currentWorkspace, loading } = useSelector(
    (state: RootState) => state.workspace
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWorkspaces());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!currentWorkspace) {
    return <div className="p-6 text-center">No workspace found</div>;
  }

  const isOwner = user?.id === currentWorkspace.owner?.id;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Workspace: {currentWorkspace.name}
        </h1>

        {isOwner && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      <StatsGrid />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProjectOverview openDialog={() => setIsDialogOpen(true)} />
          <RecentActivity />
        </div>

        <TasksSummary />
      </div>

      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
