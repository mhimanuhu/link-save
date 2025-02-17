import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SharedLinks from './pages/SharedLinks';
import Profile from './pages/Profile';
import NotFound from './components/NotFound';
import EmailConfirmation from './pages/EmailConfirmation';
import AuthLayout from './components/AuthLayout';
import { useAuthStore } from './store/auth-store';
import Footer from './components/Footer';

function App() {
  const { initialize } = useAuthStore();
  
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-gray-100 flex flex-col">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shared" element={<SharedLinks />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;