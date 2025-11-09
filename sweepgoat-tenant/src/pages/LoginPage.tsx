import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { companyName } = useBranding();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData) => (value: string) => {
    const normalizedValue = field === 'email' ? value.toLowerCase() : value;
    setFormData(prev => ({ ...prev, [field]: normalizedValue }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    try {
      // User login
      const response = await api.post('/api/auth/user/login', formData);

      // Check if email is not verified
      if ('emailVerified' in response.data && !response.data.emailVerified) {
        localStorage.setItem('pendingEmail', formData.email);
        navigate('/verify-email');
        return;
      }

      // User login successful
      if ('token' in response.data) {
        // Save user data to AuthContext and localStorage
        const userData = {
          userId: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        };
        login(userData, response.data.token);
        navigate('/'); // Redirect to home page
        return;
      }
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error: any) => {
    const newErrors: FormErrors = {};

    console.log('Login error:', error.response);

    // Check for field-specific errors
    if (error.response?.data?.fieldErrors) {
      const fieldErrors = error.response.data.fieldErrors;
      if (fieldErrors.email) newErrors.email = fieldErrors.email;
      if (fieldErrors.password) newErrors.password = fieldErrors.password;
    } else {
      // Handle general error messages
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.response?.statusText
        || error.message
        || 'Login failed. Please try again.';

      const lowerMessage = errorMessage.toLowerCase();

      // For 401 errors or credential errors, show as general error
      if (error.response?.status === 401 ||
          lowerMessage.includes('invalid') ||
          lowerMessage.includes('credentials') ||
          lowerMessage.includes('unauthorized')) {
        newErrors.general = 'Invalid email or password';
      } else if (lowerMessage.includes('email')) {
        newErrors.email = errorMessage;
      } else if (lowerMessage.includes('password')) {
        newErrors.password = errorMessage;
      } else {
        newErrors.general = errorMessage;
      }
    }

    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-base text-zinc-500 font-light">
            Log in to {companyName || 'your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
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
            useWhiteLabel
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
}