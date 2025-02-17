import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist. You'll be redirected to home in 5 seconds.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500"
        >
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </button>
      </div>
    </div>
  );
}