import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';

export default function ProfileDropdown() {
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-100 rounded-lg shadow-lg py-1 animate-slide-down z-[60]">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-200">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @{user?.user_metadata?.username || 'username'}
            </p>
          </div>
          
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Profile Settings
          </Link>
          
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}