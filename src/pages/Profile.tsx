import React from 'react';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'react-hot-toast';
import LoadingDots from '../components/LoadingDots';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: user?.user_metadata?.username || '',
    fullName: user?.user_metadata?.full_name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if username is unique
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', formData.username)
        .neq('id', user?.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        throw new Error('Username is already taken');
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: formData.username,
          full_name: formData.fullName,
        },
      });

      if (updateError) throw updateError;

      // Update profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          username: formData.username,
          full_name: formData.fullName,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-dark-100 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="opacity-75 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Choose a username"
              pattern="^[a-zA-Z0-9_]{3,20}$"
              title="Username must be between 3 and 20 characters and can only contain letters, numbers, and underscores"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Username must be between 3 and 20 characters and can only contain letters, numbers, and underscores.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Your full name"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <LoadingDots /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}