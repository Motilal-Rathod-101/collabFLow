import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

function WorkspaceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  const { workspaces, currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelectWorkspace = (id: string) => {
    dispatch(setCurrentWorkspace(id));
    setIsOpen(false);
  };

  return (
    <div className="relative m-4" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
      >
        <div className="flex items-center gap-3">
          {/* Placeholder workspace icon */}
          <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            {currentWorkspace?.name?.[0] || "W"}
          </div>

          <div className="min-w-0 text-left">
            <p className="font-semibold text-sm truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
              {workspaces.length} workspace
              {workspaces.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow top-full left-0 mt-2">
          <div className="p-2">
            <p className="text-xs uppercase text-gray-500 px-2 mb-2">
              Workspaces
            </p>

            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => onSelectWorkspace(ws.id)}
                className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  {ws.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ws.name}</p>
                </div>

                {currentWorkspace?.id === ws.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>

          <hr className="border-gray-200 dark:border-zinc-800" />

          {/* Create workspace */}
          <div
            onClick={() => {
              setShowCreateWorkspace(true);
              setIsOpen(false);
            }}
            className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-sm text-blue-600"
          >
            <Plus className="w-4 h-4" />
            Create Workspace
          </div>
        </div>
      )}

      {/* Dialog */}
      <CreateWorkspaceDialog
        show={showCreateWorkspace}
        onClose={() => setShowCreateWorkspace(false)}
      />
    </div>
  );
}

export default WorkspaceDropdown;
