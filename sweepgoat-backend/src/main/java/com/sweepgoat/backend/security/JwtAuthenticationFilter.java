package com.sweepgoat.backend.security;

import com.sweepgoat.backend.util.JwtUtil;
import com.sweepgoat.backend.util.SubdomainExtractor;
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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SubdomainExtractor subdomainExtractor;

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
}