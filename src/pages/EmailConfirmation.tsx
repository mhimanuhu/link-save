import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import LoadingDots from '../components/LoadingDots';

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Email Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your email has been successfully confirmed. Redirecting to home in {countdown} seconds...
        </p>
        <div className="flex justify-center">
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}