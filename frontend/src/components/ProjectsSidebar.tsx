import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ChevronRightIcon,
  SettingsIcon,
  KanbanIcon,
  ChartColumnIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useSelector, shallowEqual } from "react-redux";
import type { RootState } from "../app/store";

type Project = {
  id: string;
  name: string;
};

type SubItem = {
  title: string;
  icon: React.ElementType;
  tab: string;
  url: string;
};

const ProjectsSidebar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const projectIdFromUrl = searchParams.get("id");
  const activeTab = searchParams.get("tab") || "tasks";

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace,
    shallowEqual
  );

  const projects: Project[] = currentWorkspace?.projects ?? [];

  useEffect(() => {
    if (!projectIdFromUrl) return;

    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      newSet.add(projectIdFromUrl);
      return newSet;
    });
  }, [projectIdFromUrl]);

  const getProjectSubItems = (projectId: string): SubItem[] => [
    {
      title: "Tasks",
      tab: "tasks",
      icon: KanbanIcon,
      url: `/projectsDetail?id=${projectId}&tab=tasks`,
    },
    {
      title: "Analytics",
      tab: "analytics",
      icon: ChartColumnIcon,
      url: `/projectsDetail?id=${projectId}&tab=analytics`,
    },
    {
      title: "Calendar",
      tab: "calendar",
      icon: CalendarIcon,
      url: `/projectsDetail?id=${projectId}&tab=calendar`,
    },
    {
      title: "Settings",
      tab: "settings",
      icon: SettingsIcon,
      url: `/projectsDetail?id=${projectId}&tab=settings`,
    },
  ];

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="mt-6 px-3">
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
          Projects
        </h3>
        <Link to="/projects">
          <button className="size-5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded flex items-center justify-center">
            <ArrowRightIcon className="size-3" />
          </button>
        </Link>
      </div>

      <div className="space-y-1 px-3">
        {projects.map((project) => (
          <div key={project.id}>
            <button
              onClick={() => toggleProject(project.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <ChevronRightIcon
                className={`size-3 transition-transform ${
                  expandedProjects.has(project.id) ? "rotate-90" : ""
                }`}
              />
              <div className="size-2 rounded-full bg-blue-500" />
              <span className="truncate max-w-40 text-sm">
                {project.name}
              </span>
            </button>

            {expandedProjects.has(project.id) && (
              <div className="ml-5 mt-1 space-y-1">
                {getProjectSubItems(project.id).map((subItem) => {
                  const isActive =
                    location.pathname === "/projectsDetail" &&
                    projectIdFromUrl === project.id &&
                    activeTab === subItem.tab;

                  return (
                    <Link
                      key={subItem.title}
                      to={subItem.url}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs ${
                        isActive
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <subItem.icon className="size-3" />
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSidebar;
