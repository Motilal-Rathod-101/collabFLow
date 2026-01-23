
import { Plus } from 'lucide-react';
import { useState } from 'react';
import StatsGrid from '../components/StatsGrid';
import ProjectOverview from '../components/ProjectOverview';
import RecentActivity from '../components/RecentActivity';
import TasksSummary from '../components/TasksSummary';
import CreateProjectDialog from '../components/CreateProjectDialog';

const Dashboard = () => {
  const user = { fullName: 'User' };
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Welcome back, {user?.fullName || 'User'}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Here's what's happening with your projects today
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition"
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
