package com.sweepgoat.backend.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class SubdomainExtractor {

    /**
     * Extract subdomain from HTTP request
     * Examples:
     *  - host1.sweepgoat.com -> "host1"
     *  - www.sweepgoat.com -> "www"
     *  - sweepgoat.com -> null (no subdomain)
     *  - localhost:8081 -> "localhost" (for local development)
     */
    public String extractSubdomain(HttpServletRequest request) {
        String host = request.getHeader("Host");

        if (host == null || host.isEmpty()) {
            return null;
        }

        // Remove port if present (e.g., localhost:8081 -> localhost)
        if (host.contains(":")) {
            host = host.substring(0, host.indexOf(":"));
        }

        // For local development
        if (host.equals("localhost") || host.equals("127.0.0.1")) {
            // Check for X-Subdomain header (for testing/local dev)
            String subdomainHeader = request.getHeader("X-Subdomain");
            if (subdomainHeader != null && !subdomainHeader.isEmpty()) {
                return subdomainHeader;
            }
            return "localhost"; // Default for local testing
        }

        // Split by dots
        String[] parts = host.split("\\.");

        // If only one part (e.g., "localhost"), return it
        if (parts.length == 1) {
            return parts[0];
        }

        // If two parts (e.g., "sweepgoat.com"), no subdomain
        if (parts.length == 2) {
            return null;
        }

        // If three or more parts (e.g., "host1.sweepgoat.com"), first part is subdomain
        if (parts.length >= 3) {
            return parts[0];
        }

        return null;
    }

    /**
     * Check if request has a valid subdomain
     */
    public boolean hasSubdomain(HttpServletRequest request) {
        String subdomain = extractSubdomain(request);
        return subdomain != null && !subdomain.isEmpty() && !subdomain.equals("www");
    }

    /**
     * Build full domain from subdomain
     * Example: "host1" -> "host1.sweepgoat.com"
     */
    public String buildFullDomain(String subdomain, String baseDomain) {
        if (subdomain == null || subdomain.isEmpty()) {
            return baseDomain;
        }
        return subdomain + "." + baseDomain;
    }

    /**
     * Check if request is from main domain (sweepgoat.com or localhost without subdomain)
     * Used to restrict host registration to main domain only
     */
    public boolean isMainDomain(HttpServletRequest request) {
        String host = request.getHeader("Host");

        if (host == null || host.isEmpty()) {
            return false;
        }

        // Remove port if present
        if (host.contains(":")) {
            host = host.substring(0, host.indexOf(":"));
        }

        // For local development - check X-Subdomain header
        if (host.equals("localhost") || host.equals("127.0.0.1")) {
            String subdomainHeader = request.getHeader("X-Subdomain");
            // Main domain if no X-Subdomain header or it's empty/null
            return subdomainHeader == null || subdomainHeader.isEmpty();
        }

        // Split by dots
        String[] parts = host.split("\\\\.");

        // sweepgoat.com (2 parts) = main domain
        // host1.sweepgoat.com (3+ parts) = subdomain
        return parts.length == 2;
    }

    /**
     * Check if request is from a subdomain (host1.sweepgoat.com or localhost with X-Subdomain header)
     * Used to restrict user registration to subdomains only
     */
    public boolean isSubdomain(HttpServletRequest request) {
        return hasSubdomain(request);
    }
}