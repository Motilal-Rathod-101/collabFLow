import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileStackIcon,
  ZapIcon,
} from "lucide-react";

import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";

import type { RootState } from "../app/store";

import type {
  WorkspaceProject,
  Task,
} from "../features/workspaceSlice";

type ProjectStatus =| "PLANNING"| "ACTIVE"| "ON_HOLD"| "COMPLETED"| "CANCELLED";

export default function ProjectDetail() {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "tasks";
  const id = searchParams.get("id");

  const navigate = useNavigate();

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const projects = currentWorkspace?.projects ?? [];

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeTab, setActiveTab] = useState(tab);

  // sync tab with URL
  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

    useEffect(() => {
    if (!id || projects.length === 0 || !currentWorkspace) return;

    const found = projects.find((p) => p.id === id) ?? null;
    if (!found) return;
let formattedTasks: Task[] = [];

if (found.tasks) {
  formattedTasks = found.tasks.map((task: any) => {
    let assignedUser = null;

    for (let member of currentWorkspace.members) {
      if (member.user.id === task.assignee) {
        assignedUser = member;
        break;
      }
    }

    return {
      ...task,
      projectId: found.id,
      assignee: assignedUser
        ? {
            id: assignedUser.user.id,
            name:
              assignedUser.user.first_name +
              " " +
              assignedUser.user.last_name,
            image: assignedUser.user.image,
          }
        : null,
    };
  });
}

setProject(found);
setTasks(formattedTasks);

  }, [id, projects, currentWorkspace]);
  if (!currentWorkspace) {
    return <div className="p-6">Loading workspace...</div>;
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="text-2xl mb-6">Project not found</p>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const statusColors: Record<ProjectStatus, string> = {
    PLANNING: "bg-gray-200",
    ACTIVE: "bg-emerald-200",
    ON_HOLD: "bg-amber-200",
    COMPLETED: "bg-blue-200",
    CANCELLED: "bg-red-200",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/projects")}>
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <span className={`px-2 py-1 text-xs rounded ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <PlusIcon className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Tasks" value={tasks.length} />
        <Stat
          label="Completed"
          value={tasks.filter((t) => t.status === "DONE").length}
        />
        <Stat
          label="In Progress"
          value={tasks.filter((t) => t.status !== "DONE").length}
        />
        <Stat
          label="Team Members"
          value={currentWorkspace.members.length}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border rounded overflow-hidden">
        {[
          { key: "tasks", label: "Tasks", icon: FileStackIcon },
          { key: "calendar", label: "Calendar", icon: CalendarIcon },
          { key: "analytics", label: "Analytics", icon: BarChart3Icon },
          { key: "settings", label: "Settings", icon: SettingsIcon },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key);
              setSearchParams({ id: id!, tab: t.key });
            }}
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === t.key ? "bg-gray-200" : ""
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "tasks" && <ProjectTasks tasks={tasks} />}
      {activeTab === "calendar" && <ProjectCalendar tasks={tasks} />}
      {activeTab === "analytics" && (
        <ProjectAnalytics tasks={tasks} project={project} />
      )}
      {activeTab === "settings" && <ProjectSettings project={project} />}

      {/* Modal */}
      {showCreateTask && (
        <CreateTaskDialog
          showCreateTask={showCreateTask}
          setShowCreateTask={setShowCreateTask}
          projectId={project.id}
        />
      )}
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="border p-4 rounded">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);
