import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";

function WorkspaceDropdown() {
  const { workspaces, currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSelectWorkspace = (workspaceId: string) => {
    dispatch(setCurrentWorkspace(workspaceId));
    setIsOpen(false);
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative m-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-3">
          <img
            src={currentWorkspace?.image_url || "/placeholder.png"}
            alt={currentWorkspace?.name}
            className="w-8 h-8 rounded shadow"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
              {workspaces.length} workspace
              {workspaces.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full left-0">
          <div className="p-2">
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
              Workspaces
            </p>

            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => onSelectWorkspace(ws.id)}
                className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <img
                  src={ws.image_url || "/placeholder.png"}
                  alt={ws.name}
                  className="w-6 h-6 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {ws.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                    {ws.members?.length || 0} members
                  </p>
                </div>

                {currentWorkspace?.id === ws.id && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            ))}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          <div className="p-2 cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800">
            <p className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400">
              <Plus className="w-4 h-4" /> Create Workspace
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDropdown;
