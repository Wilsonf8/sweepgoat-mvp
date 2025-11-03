import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginHost } from '../services/authService';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState<FormData>({
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

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await loginHost(formData);

      // Check if email is not verified (200 OK but emailVerified: false)
      if ('emailVerified' in response && !response.emailVerified) {
        // Store email for verification page
        localStorage.setItem('pendingEmail', formData.email);
        // Redirect to verification page
        navigate('/verify-email');
        return;
      }

      // At this point, we know response has token, subdomain, companyName
      // Use type assertion for TypeScript
      const successResponse = response as { token: string; subdomain: string; companyName: string };

      // Store auth data in localStorage
      localStorage.setItem('hostToken', successResponse.token);
      localStorage.setItem('subdomain', successResponse.subdomain);
      localStorage.setItem('companyName', successResponse.companyName);

      // Navigate to success page
      navigate('/success');
    } catch (error: any) {
      const newErrors: FormErrors = {};

      // Check if email is not verified (403 error with emailVerified: false)
      if (error.response?.status === 403 && error.response?.data?.emailVerified === false) {
        // Store email for verification page
        localStorage.setItem('pendingEmail', formData.email);
        // Redirect to verification page
        navigate('/verify-email');
        return;
      }

      // Check if backend returned field-specific errors (400 validation errors)
      if (error.response?.data?.fieldErrors) {
        const fieldErrors = error.response.data.fieldErrors;

        // Map backend field errors to form errors
        if (fieldErrors.email) {
          newErrors.email = fieldErrors.email;
        }
        if (fieldErrors.password) {
          newErrors.password = fieldErrors.password;
        }
      } else {
        // Handle simple error messages (401 unauthorized, etc.)
        const errorMessage = error.response?.data?.message
          || error.response?.data?.error
          || error.response?.statusText
          || error.message;

        if (errorMessage) {
          // Check for field-specific errors in the message text
          const lowerMessage = errorMessage.toLowerCase();

          if (lowerMessage.includes('email')) {
            newErrors.email = errorMessage;
          } else if (lowerMessage.includes('password')) {
            newErrors.password = errorMessage;
          } else if (lowerMessage.includes('credentials') || lowerMessage.includes('invalid')) {
            // Show as general error for invalid credentials
            newErrors.general = errorMessage;
          } else {
            // If we can't determine the field, show as general error
            newErrors.general = errorMessage;
          }
        } else {
          newErrors.general = 'Login failed. Please try again.';
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
            Welcome Back
          </h1>
          <p className="text-base text-zinc-500 font-light">
            Log in to access your giveaway platform
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
            Log In
          </Button>
        </form>

        {/* Signup Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500 font-light">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-white hover:text-zinc-300 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};