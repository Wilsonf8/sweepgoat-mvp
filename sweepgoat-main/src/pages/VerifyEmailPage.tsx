import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { verifyHostEmail, resendVerificationCode } from '../services/authService';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Get email from localStorage on mount
  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingEmail');
    if (!pendingEmail) {
      // If no email in localStorage, redirect to signup
      navigate('/signup');
      return;
    }
    setEmail(pendingEmail);
  }, [navigate]);

  // Handle verification code submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate code
    if (!code) {
      setError('Verification code is required');
      return;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call verification API
      await verifyHostEmail({ email, code });

      // Clear pending email from localStorage
      localStorage.removeItem('pendingEmail');

      // Redirect to login with success message
      navigate('/login', { state: { message: 'Email verified successfully! Please log in.' } });
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    setError('');

    try {
      const response = await resendVerificationCode({ email });
      setResendMessage(response.message);
      setCode(''); // Clear the code input
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } finally {
      setIsResending(false);
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
            Verify Your Email
          </h1>
          <p className="text-base text-zinc-500 font-light mb-2">
            We sent a 6-digit verification code to
          </p>
          <p className="text-base text-white font-normal">
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 border border-red-500 bg-red-500/10 rounded">
              <p className="text-sm text-red-400 font-light">{error}</p>
            </div>
          )}

          {/* Success Message (Resend) */}
          {resendMessage && (
            <div className="p-4 border border-green-500 bg-green-500/10 rounded">
              <p className="text-sm text-green-400 font-light">{resendMessage}</p>
            </div>
          )}

          {/* Verification Code Input */}
          <Input
            label="Verification Code"
            value={code}
            onChange={(value) => {
              setCode(value);
              setError('');
            }}
            error={error && !code ? error : undefined}
            placeholder="123456"
            required
            disabled={isLoading}
          />

          {/* Verify Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !code}
          >
            Verify Email
          </Button>
        </form>

        {/* Resend Code */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500 font-light mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-sm text-white hover:text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light"
          >
            {isResending ? 'Sending...' : 'Resend verification code'}
          </button>
        </div>

        {/* Back to Signup */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-light"
          >
            ← Back to signup
          </button>
        </div>
      </div>
    </div>
  );
};