// ============================================================================
// SHARED TYPESCRIPT TYPES FOR SWEEPGOAT
// This file contains TypeScript types matching backend DTOs
// Used by both sweepgoat-main and sweepgoat-tenant
// ============================================================================

// ============================================================================
// AUTH - HOST (Main Site)
// ============================================================================

export interface HostRegisterRequest {
  subdomain: string;
  companyName: string;
  email: string;
  password: string;
}

export interface HostLoginRequest {
  email: string;
  password: string;
}

export interface HostLoginResponse {
  token: string;
  role: 'HOST';
  id: number;
  email: string;
  subdomain: string;
  companyName: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// ============================================================================
// AUTH - USER (Tenant Site)
// ============================================================================

// TODO: Define UserRegisterRequest
// TODO: Define UserLoginRequest
// TODO: Define UserLoginResponse
// TODO: Define VerifyEmailRequest
// TODO: Define ResendVerificationRequest

// ============================================================================
// GIVEAWAY
// ============================================================================

// TODO: Define Giveaway
// TODO: Define GiveawayStatus type
// TODO: Define CreateGiveawayRequest
// TODO: Define GiveawayStatsResponse
// TODO: Define LeaderboardEntry

// ============================================================================
// GIVEAWAY ENTRY
// ============================================================================

// TODO: Define GiveawayEntryRequest
// TODO: Define GiveawayEntryResponse
// TODO: Define UserEntryResponse

// ============================================================================
// USER / CRM
// ============================================================================

// TODO: Define UserListResponse
// TODO: Define PaginatedResponse<T>
// TODO: Define UserSortBy type
// TODO: Define SortOrder type

// ============================================================================
// BRANDING
// ============================================================================

// TODO: Define BrandingResponse
// TODO: Define UpdateBrandingRequest

// ============================================================================
// MARKETING CAMPAIGNS
// ============================================================================

// TODO: Define CampaignType type
// TODO: Define CampaignStatus type
// TODO: Define SendCampaignRequest
// TODO: Define SendCampaignResponse

// ============================================================================
// COMMON RESPONSES
// ============================================================================

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
  email?: string;
  emailVerified?: boolean;
}

// ============================================================================
// NOTES
// ============================================================================

// When filling out these types:
// 1. Match backend DTOs exactly (refer to sweepgoat-backend/Claude.md)
// 2. Use ISO 8601 strings for dates (not Date objects)
// 3. Use union types for enums (e.g., 'ACTIVE' | 'ENDED' | 'CANCELLED')
// 4. Mark optional fields with ? (e.g., imageUrl?: string | null)