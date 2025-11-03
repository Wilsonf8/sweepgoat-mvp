import api from './api';

export interface SubdomainValidationResponse {
  exists: boolean;
  subdomain?: string;
  companyName?: string;
  isMainDomain?: boolean;
  branding?: {
    logoUrl: string | null;
    primaryColor: string;
  };
}

/**
 * Validates if a subdomain exists and is verified
 * Called on app initialization to check if the subdomain is valid
 * @returns Promise with validation response
 */
export const validateSubdomain = async (): Promise<SubdomainValidationResponse> => {
  try {
    const response = await api.get('/api/public/subdomain/validate');
    return response.data;
  } catch (error: any) {
    // If 404, subdomain doesn't exist or host email not verified
    if (error.response?.status === 404 && error.response?.data) {
      return error.response.data;
    }
    // For other errors, throw to handle elsewhere
    throw error;
  }
};