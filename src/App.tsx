import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthLayout from './components/AuthLayout';
import { useAuthStore } from './store/auth-store';

function App() {
  const { initialize } = useAuthStore();
  
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-gray-100">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;