import api from './api'

// Interface for signup request
interface SignupRequest {
    subdomain: string;
    companyName: string;
    email: string;
    password: string;
}

interface SignupResponse {
    message: string;
}

// Interface for login request
interface LoginRequest {
    email: string;
    password: string;
}

// Union type for login response - can be success or unverified email
type LoginResponse =
    | {
        token: string;
        userType: string;
        hostId: number;
        email: string;
        subdomain: string;
        companyName: string;
      }
    | {
        emailVerified: false;
        email: string;
        message: string;
      };

// Interface for verify email request
interface VerifyEmailRequest {
    email: string;
    code: string;
}

interface VerifyEmailResponse {
    message: string;
}

// Interface for resend verification request
interface ResendVerificationRequest {
    email: string;
}

interface ResendVerificationResponse {
    message: string;
}

// Register a new host
export const registerHost = async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await api.post('/api/auth/host/register', data);
    return response.data;
}

// Login a host
export const loginHost = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/host/login', data);
    return response.data;
}

// Verify host email with 6-digit code
export const verifyHostEmail = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await api.post('/api/auth/host/verify-email', data);
    return response.data;
}

// Resend verification code
export const resendVerificationCode = async (data: ResendVerificationRequest): Promise<ResendVerificationResponse> => {
    const response = await api.post('/api/auth/host/resend-verification', data);
    return response.data;
}