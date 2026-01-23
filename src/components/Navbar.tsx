import { SearchIcon, PanelLeft, MoonIcon, SunIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'
import { assets } from '../assets/assets'
import type { RootState, AppDispatch } from '../app/store'

interface NavbarProps {
  // optional for desktop-only
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.theme.theme)

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">

        {/* Left section */}
        <div className="flex items-center gap-4 min-w-0 flex-1">

          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-8 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95"
          >
            {theme === 'light'
              ? <MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />
              : <SunIcon className="size-4 text-yellow-400" />
            }
          </button>

          {/* User detail btn */}
          <img src={assets.profile_img_a} alt="User Img" className="size-7 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
