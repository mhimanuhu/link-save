import React from 'react';
import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';

export default function Navbar() {
  const { signOut, user } = useAuthStore();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-dark-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
            LinkSaver
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200">
              <Bell className="w-5 h-5" />
            </button>
            
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

            <div className="flex items-center space-x-2">
              <span>{user.email}</span>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}