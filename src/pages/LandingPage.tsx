import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'react-hot-toast';
import LoadingDots from '../components/LoadingDots';

export default function LandingPage() {
  const { signIn, signUp, user } = useAuthStore();
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        toast.success('Account created! Please sign in.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white dark:bg-dark-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
              LinkSaver
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 animate-slide-down">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isLogin
                ? 'Sign in to access your links'
                : 'Start organizing your links today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoadingDots />
                ) : (
                  isLogin ? 'Sign in' : 'Sign up'
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}