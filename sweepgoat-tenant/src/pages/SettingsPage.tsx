import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SettingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      // TODO: Implement password change endpoint
      // await api.post('/api/user/change-password', {
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Show error for now since endpoint doesn't exist
      setErrors({
        general:
          'Password change feature is not yet implemented. Please contact support.',
      });
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message || 'Failed to change password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400 font-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-2xl py-20 md:py-32 pt-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Settings
          </h1>
          <p className="text-base text-zinc-400 font-light leading-relaxed">
            Manage your account settings
          </p>
        </div>

        {/* Change Password Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-white mb-6 border-b border-zinc-800 pb-4">
            Change Password
          </h2>

          {/* Info Message */}
          <div className="mb-6 p-4 border border-yellow-500/20 bg-yellow-500/10 rounded">
            <p className="text-sm text-yellow-400 font-light">
              Password change feature is coming soon. This form is not yet functional.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 border border-red-500 bg-red-500/10 rounded">
                <p className="text-sm text-red-400 font-light">{errors.general}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 border border-green-500 bg-green-500/10 rounded">
                <p className="text-sm text-green-400 font-light">
                  Password changed successfully!
                </p>
              </div>
            )}

            {/* Current Password */}
            <Input
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange('currentPassword')}
              error={errors.currentPassword}
              placeholder="••••••••"
              required
            />

            {/* New Password */}
            <Input
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
              error={errors.newPassword}
              placeholder="••••••••"
              required
              helperText="Minimum 8 characters"
            />

            {/* Confirm Password */}
            <Input
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              useWhiteLabel
            >
              Update Password
            </Button>
          </form>
        </section>
      </div>

      <Footer onManagementLoginClick={() => navigate('/host/login')} />
    </div>
  );
}