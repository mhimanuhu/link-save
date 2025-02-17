import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { user } = useAuthStore();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-dark-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              LinkSaver
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                My Links
              </Link>
              <Link
                to="/shared"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                Shared Links
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/shared"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 relative"
            >
              <Bell className="w-5 h-5" />
              {/* Add notification badge here if needed */}
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}