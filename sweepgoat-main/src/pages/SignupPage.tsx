import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { registerHost } from '../services/authService';

interface FormData {
  subdomain: string;
  companyName: string;
  email: string;
  password: string;
}

interface FormErrors {
  subdomain?: string;
  companyName?: string;
  email?: string;
  password?: string;
  general?: string;
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    subdomain: '',
    companyName: '',
    email: '',
    password: '',
  });

  // Error state
  const [errors, setErrors] = useState<FormErrors>({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to update form data
  const handleChange = (field: keyof FormData) => (value: string) => {
    // Normalize email to lowercase
    const normalizedValue = field === 'email' ? value.toLowerCase() : value;

    setFormData(prev => ({ ...prev, [field]: normalizedValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Subdomain validation
    if (!formData.subdomain) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain must be lowercase letters, numbers, and hyphens only';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters';
    }

    // Company name validation
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call API
      await registerHost(formData);

      // Store email for verification page
      localStorage.setItem('pendingEmail', formData.email);

      // Navigate to verification page
      navigate('/verify-email');
    } catch (error: any) {
      const newErrors: FormErrors = {};

      // Check if backend returned field-specific errors (400 validation errors)
      if (error.response?.data?.fieldErrors) {
        const fieldErrors = error.response.data.fieldErrors;

        // Map backend field errors to form errors
        if (fieldErrors.subdomain) {
          newErrors.subdomain = fieldErrors.subdomain;
        }
        if (fieldErrors.companyName) {
          newErrors.companyName = fieldErrors.companyName;
        }
        if (fieldErrors.email) {
          newErrors.email = fieldErrors.email;
        }
        if (fieldErrors.password) {
          newErrors.password = fieldErrors.password;
        }
      } else {
        // Handle simple error messages (409 conflicts, 403 forbidden, etc.)
        const errorMessage = error.response?.data?.message
          || error.response?.data?.error
          || error.response?.statusText
          || error.message;

        if (errorMessage) {
          // Check for field-specific errors in the message text
          const lowerMessage = errorMessage.toLowerCase();

          if (lowerMessage.includes('subdomain')) {
            newErrors.subdomain = errorMessage;
          } else if (lowerMessage.includes('email')) {
            newErrors.email = errorMessage;
          } else if (lowerMessage.includes('company')) {
            newErrors.companyName = errorMessage;
          } else if (lowerMessage.includes('password')) {
            newErrors.password = errorMessage;
          } else {
            // If we can't determine the field, show as general error
            newErrors.general = errorMessage;
          }
        } else {
          newErrors.general = 'Registration failed. Please try again.';
        }
      }

      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-white">Sweepgoat</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-base text-zinc-500 font-light">
            Start running giveaways under your brand
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error Message */}
          {errors.general && (
            <div className="p-4 border border-red-500 bg-red-500/10 rounded">
              <p className="text-sm text-red-400 font-light">{errors.general}</p>
            </div>
          )}

          {/* Subdomain Input */}
          <Input
            label="Subdomain"
            value={formData.subdomain}
            onChange={handleChange('subdomain')}
            error={errors.subdomain}
            placeholder="yourbrand"
            required
          />

          {/* Company Name Input */}
          <Input
            label="Company Name"
            value={formData.companyName}
            onChange={handleChange('companyName')}
            error={errors.companyName}
            placeholder="Acme Inc"
            required
          />

          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder="you@example.com"
            required
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
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
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500 font-light">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:text-zinc-300 transition-colors"
            >
              Log in
            </button>
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-zinc-500 font-light">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-zinc-300 transition-colors"
            >
              ← Back to home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};