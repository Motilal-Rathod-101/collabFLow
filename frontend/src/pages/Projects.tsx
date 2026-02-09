import { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Plus, Search, FolderOpen } from "lucide-react";

import ProjectCard from "../components/ProjectCard";
import CreateProjectDialog from "../components/CreateProjectDialog";
import EditProjectDialog from "../components/EditProjectDialog";

import type { RootState } from "../app/store";
import type { Project } from "../features/projectsSlice";

export default function Projects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const projects: Project[] = currentWorkspace?.projects ?? [];

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">Manage and track your projects</p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded"
        >
          <Plus className="w-4 h-4 mr-2" /> New Project
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
            />
          ))
        )}
      </div>

      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <EditProjectDialog
        isDialogOpen={isEditOpen}
        setIsDialogOpen={setIsEditOpen}
        project={editingProject}
      />
    </div>
  );
}
