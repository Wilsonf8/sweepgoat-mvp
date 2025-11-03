import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useBranding } from '../context/BrandingContext';
import api from '../services/api';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  general?: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const { companyName } = useBranding();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
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

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
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

    try {
      // User registration
      await api.post('/api/auth/user/register', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      // Store email for verification page
      localStorage.setItem('pendingEmail', formData.email);

      // Navigate to verification page
      navigate('/verify-email');
    } catch (error: any) {
      handleSignupError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupError = (error: any) => {
    const newErrors: FormErrors = {};

    console.log('Signup error:', error.response);

    // Check for field-specific errors
    if (error.response?.data?.fieldErrors) {
      const fieldErrors = error.response.data.fieldErrors;
      if (fieldErrors.email) newErrors.email = fieldErrors.email;
      if (fieldErrors.password) newErrors.password = fieldErrors.password;
      if (fieldErrors.firstName) newErrors.firstName = fieldErrors.firstName;
      if (fieldErrors.lastName) newErrors.lastName = fieldErrors.lastName;
      if (fieldErrors.phoneNumber) newErrors.phoneNumber = fieldErrors.phoneNumber;
    } else {
      // Handle general error messages
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.response?.statusText
        || error.message
        || 'Registration failed. Please try again.';

      const lowerMessage = errorMessage.toLowerCase();

      // Map errors to specific fields
      if (lowerMessage.includes('email')) {
        newErrors.email = errorMessage;
      } else if (lowerMessage.includes('password')) {
        newErrors.password = errorMessage;
      } else if (lowerMessage.includes('phone')) {
        newErrors.phoneNumber = errorMessage;
      } else if (lowerMessage.includes('first name')) {
        newErrors.firstName = errorMessage;
      } else if (lowerMessage.includes('last name')) {
        newErrors.lastName = errorMessage;
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
            Create Your Account
          </h1>
          <p className="text-base text-zinc-500 font-light">
            Join {companyName || 'us'} and enter giveaways
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

          {/* First Name Input */}
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={errors.firstName}
            placeholder="John"
            required
          />

          {/* Last Name Input */}
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={errors.lastName}
            placeholder="Doe"
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

          {/* Phone Number Input */}
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            error={errors.phoneNumber}
            placeholder="+1234567890"
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

          {/* Confirm Password Input */}
          <Input
            label="Confirm Password"
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
      </div>
    </div>
  );
}