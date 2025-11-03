package com.sweepgoat.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.service.SubdomainValidationService;
import com.sweepgoat.backend.util.SubdomainExtractor;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Filter that validates subdomains before processing any request.
 *
 * - Extracts X-Subdomain header from all requests
 * - Validates subdomain exists and host email is verified
 * - Returns 404 for invalid/unverified subdomains
 * - Whitelists certain endpoints (host auth, subdomain validation)
 * - Runs early in the filter chain, before authentication
 * - Uses caching for performance (10-minute cache)
 */
@Component
public class SubdomainValidationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(SubdomainValidationFilter.class);

    @Autowired
    private SubdomainExtractor subdomainExtractor;

    @Autowired
    private SubdomainValidationService subdomainValidationService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Endpoints that should SKIP subdomain validation
     * These are accessible even with invalid/missing subdomains
     */
    private static final List<String> WHITELISTED_PATHS = Arrays.asList(
        "/api/auth/host/register",
        "/api/auth/host/login",
        "/api/auth/host/verify-email",
        "/api/auth/host/resend-verification",
        "/api/public/subdomain/validate",
        "/api/public/subdomain/branding",
        "/health",
        "/"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Skip validation for whitelisted endpoints
        if (isWhitelisted(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract subdomain from request
        String subdomain = subdomainExtractor.extractSubdomain(request);

        // If no subdomain (main domain request), allow it to proceed
        if (subdomain == null || subdomain.isEmpty() || subdomain.equals("www")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Validate subdomain (with caching)
        try {
            Host host = subdomainValidationService.validateSubdomain(subdomain);

            // Check if subdomain is valid (exists and email verified)
            if (host == null) {
                logger.info("Subdomain validation failed - subdomain='{}' does not exist or host email not verified", subdomain);
                sendNotFoundResponse(response, requestPath, "This site cannot be reached");
                return;
            }

            // Valid subdomain - attach host info to request for later use by controllers
            request.setAttribute("validatedHost", host);
            request.setAttribute("validatedSubdomain", subdomain);

            // Proceed to next filter
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Database error or other unexpected error
            logger.error("Error validating subdomain '{}': {}", subdomain, e.getMessage(), e);
            sendServiceUnavailableResponse(response, requestPath, "Service temporarily unavailable");
        }
    }

    /**
     * Check if the request path is whitelisted (should skip validation)
     */
    private boolean isWhitelisted(String path) {
        return WHITELISTED_PATHS.stream().anyMatch(path::startsWith);
    }

    /**
     * Send 404 Not Found response for invalid subdomains
     */
    private void sendNotFoundResponse(HttpServletResponse response, String path, String message) throws IOException {
        response.setStatus(HttpStatus.NOT_FOUND.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 404);
        errorResponse.put("error", "Not Found");
        errorResponse.put("message", message);
        errorResponse.put("path", path);

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    /**
     * Send 503 Service Unavailable response for database errors
     */
    private void sendServiceUnavailableResponse(HttpServletResponse response, String path, String message) throws IOException {
        response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", 503);
        errorResponse.put("error", "Service Unavailable");
        errorResponse.put("message", message);
        errorResponse.put("path", path);

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}