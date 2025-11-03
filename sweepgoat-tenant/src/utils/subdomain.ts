/**
 * Extracts the subdomain from the current hostname
 *
 * Examples:
 * - acme.sweepgoat.local:3001 → "acme"
 * - demo.sweepgoat.com → "demo"
 * - test.localhost:3001 → "test"
 * - localhost:3001 → fallback to VITE_DEV_SUBDOMAIN env var
 *
 * @returns The subdomain string
 */
export const getSubdomain = (): string => {
  const hostname = window.location.hostname;

  // If we're on plain localhost (no subdomain), use the dev subdomain from env
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_DEV_SUBDOMAIN || 'demo';
  }

  // Split the hostname by dots
  const parts = hostname.split('.');

  // If we have at least 2 parts, check if it's a subdomain
  // e.g., test.localhost → ['test', 'localhost']
  // e.g., acme.sweepgoat.local → ['acme', 'sweepgoat', 'local']
  if (parts.length >= 2) {
    // Check if the last part is 'localhost' or we have at least 3 parts
    const isLocalhost = parts[parts.length - 1] === 'localhost';
    const hasSubdomain = parts.length >= 3 || isLocalhost;

    if (hasSubdomain) {
      return parts[0];
    }
  }

  // Fallback to dev subdomain
  return import.meta.env.VITE_DEV_SUBDOMAIN || 'demo';
};