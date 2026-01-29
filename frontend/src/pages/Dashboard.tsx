import { Plus } from 'lucide-react';
import { useState } from 'react';
import StatsGrid from '../components/StatsGrid';
import ProjectOverview from '../components/ProjectOverview';
import RecentActivity from '../components/RecentActivity';
import TasksSummary from '../components/TasksSummary';
import CreateProjectDialog from '../components/CreateProjectDialog';
import './Dashboard.css';

const Dashboard = () => {
  const user = { fullName: 'User' };
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto dashboard-container">
      {/* Header */}
      <div className="flex justify-between items-start gap-6 mb-6 dashboard-header">
        <div>
          <h1 className="text-2xl font-semibold mb-1 dashboard-title">
            Welcome back, {user?.fullName || 'User'}
          </h1>
          <p className="text-sm dashboard-subtitle">
            Here's what's happening with your projects today
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-5 py-2 text-sm rounded transition dashboard-btn"
        >
          <Plus size={16} /> New Project
        </button>

        {/* Dialog */}
        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProjectOverview openDialog={() => setIsDialogOpen(true)} />
          <RecentActivity />
        </div>
        <div>
          <TasksSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
