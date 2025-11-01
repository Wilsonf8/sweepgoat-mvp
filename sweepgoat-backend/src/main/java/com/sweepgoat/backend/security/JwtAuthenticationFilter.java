package com.sweepgoat.backend.security;

import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.repository.HostRepository;
import com.sweepgoat.backend.util.JwtUtil;
import com.sweepgoat.backend.util.SubdomainExtractor;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SubdomainExtractor subdomainExtractor;

    @Autowired
    private HostRepository hostRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Extract Authorization header
        final String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String username = null;

        // Check if Authorization header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Remove "Bearer " prefix

            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Error extracting username from JWT: " + e.getMessage());
            }
        }

        // If we have a valid JWT and no authentication is set yet
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Validate the token
            if (jwtUtil.validateToken(jwt)) {

                // Extract additional info from token
                Long userId = jwtUtil.extractUserId(jwt); // Only present for USER tokens
                Long hostId = jwtUtil.extractHostId(jwt);
                String userType = jwtUtil.extractUserType(jwt);

                // Extract subdomain from request
                String subdomain = subdomainExtractor.extractSubdomain(request);

                // Validate subdomain matches token's hostId
                if (!validateSubdomainMatchesToken(subdomain, hostId, request.getRequestURI(), response)) {
                    // Validation failed, error response already sent
                    return;
                }

                // Create authority based on user type
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userType);

                // Create authentication token
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(authority)
                    );

                // Set additional details (hostId, subdomain, etc.)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Store info in request attributes for easy access in controllers
                if (userId != null) {
                    request.setAttribute("userId", userId);
                }
                request.setAttribute("hostId", hostId);
                request.setAttribute("subdomain", subdomain);
                request.setAttribute("userType", userType);

                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authToken);

                logger.debug("JWT validated for user: " + username + ", userId: " + userId + ", hostId: " + hostId + ", subdomain: " + subdomain);
            }
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Validate that the subdomain in the request matches the hostId in the JWT token
     * Returns true if validation passes, false if validation fails (response already sent)
     */
    private boolean validateSubdomainMatchesToken(String subdomain, Long hostId,
                                                   String requestURI, HttpServletResponse response)
                                                   throws IOException {
        // Skip validation for auth and public endpoints
        if (requestURI.startsWith("/api/auth/") ||
            requestURI.startsWith("/api/public/") ||
            requestURI.equals("/") ||
            requestURI.equals("/health")) {
            return true;
        }

        // If no subdomain provided, allow (some endpoints don't require it)
        if (subdomain == null || subdomain.isEmpty()) {
            return true;
        }

        // Look up host by subdomain
        Optional<Host> hostOptional = hostRepository.findBySubdomain(subdomain);

        if (hostOptional.isEmpty()) {
            // Subdomain doesn't exist
            sendForbiddenResponse(response, "Invalid subdomain",
                "The subdomain '" + subdomain + "' does not exist");
            logger.warn("Security: Invalid subdomain attempted: " + subdomain);
            return false;
        }

        Host host = hostOptional.get();

        // Verify host ID matches token's host ID
        if (!host.getId().equals(hostId)) {
            // Subdomain/token mismatch - security violation!
            sendForbiddenResponse(response, "Subdomain/token mismatch",
                "Your authentication token does not match the requested subdomain");
            logger.warn("Security: Subdomain/token mismatch - Token hostId: " + hostId +
                       ", Subdomain: " + subdomain + " (hostId: " + host.getId() + ")");
            return false;
        }

        // Validation passed
        return true;
    }

    /**
     * Send a 403 Forbidden response with JSON error message
     */
    private void sendForbiddenResponse(HttpServletResponse response, String error, String message)
                                        throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        Map<String, String> errorBody = new HashMap<>();
        errorBody.put("error", error);
        errorBody.put("message", message);

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(errorBody));
    }
}