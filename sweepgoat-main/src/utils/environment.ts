/**
 * Environment utility for detecting dev vs production
 * and generating environment-aware URLs
 */

/**
 * Check if running in production environment
 * @returns true if running on sweepgoat.com domain
 */
export function isProduction(): boolean {
  const hostname = window.location.hostname;
  return hostname.includes('sweepgoat.com');
}

/**
 * Check if running in development environment
 * @returns true if running on localhost
 */
export function isDevelopment(): boolean {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Get the current domain
 * @returns Current domain (e.g., "localhost", "sweepgoat.com")
 */
export function getDomain(): string {
  return window.location.hostname;
}

/**
 * Generate subdomain URL based on current environment
 *
 * Development: http://subdomain.localhost:3001
 * Production: https://subdomain.sweepgoat.com
 *
 * @param subdomain - The subdomain to generate URL for
 * @returns Full URL to the subdomain
 */
export function getSubdomainUrl(subdomain: string): string {
  if (isDevelopment()) {
    return `http://${subdomain}.localhost:3001`;
  } else if (isProduction()) {
    return `https://${subdomain}.sweepgoat.com`;
  } else {
    // Fallback for other environments (e.g., staging)
    return `https://${subdomain}.${getDomain()}`;
  }
}