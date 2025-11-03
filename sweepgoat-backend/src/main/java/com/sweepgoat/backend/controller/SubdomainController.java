package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.BrandingResponse;
import com.sweepgoat.backend.repository.HostRepository;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.util.SubdomainExtractor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/subdomain")
public class SubdomainController {

    private static final String DEFAULT_PRIMARY_COLOR = "#FFFF00"; // Yellow

    @Autowired
    private SubdomainExtractor subdomainExtractor;

    @Autowired
    private HostRepository hostRepository;

    /**
     * GET /api/public/subdomain/validate
     * Check if the current subdomain exists and is valid
     * Returns subdomain info including branding if it exists AND email is verified
     *
     * Response when subdomain exists and is verified (200 OK):
     * {
     *   "exists": true,
     *   "subdomain": "acme",
     *   "companyName": "Acme Inc",
     *   "branding": {
     *     "logoUrl": "https://...",
     *     "primaryColor": "#FFFF00"
     *   }
     * }
     *
     * Response when subdomain does NOT exist or email NOT verified (404 Not Found):
     * {
     *   "exists": false,
     *   "subdomain": "wilson"
     * }
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateSubdomain(HttpServletRequest request) {
        String subdomain = subdomainExtractor.extractSubdomain(request);

        Map<String, Object> response = new HashMap<>();

        // Check if it's the main domain (no subdomain)
        if (subdomain == null || subdomain.isEmpty() || subdomain.equals("www")) {
            response.put("exists", true);
            response.put("isMainDomain", true);
            return ResponseEntity.ok(response);
        }

        // Check if subdomain exists in database
        Host host = hostRepository.findBySubdomain(subdomain).orElse(null);

        if (host == null) {
            // Subdomain does not exist
            response.put("exists", false);
            response.put("subdomain", subdomain);
            return ResponseEntity.status(404).body(response);
        }

        // Check if host has verified their email
        // Only verified hosts should have accessible subdomains
        if (!host.getEmailVerified()) {
            // Subdomain exists but email not verified - treat as not found
            response.put("exists", false);
            response.put("subdomain", subdomain);
            return ResponseEntity.status(404).body(response);
        }

        // Subdomain exists AND email is verified - return info including branding
        response.put("exists", true);
        response.put("subdomain", host.getSubdomain());
        response.put("companyName", host.getCompanyName());

        // Add branding information
        Map<String, String> branding = new HashMap<>();
        branding.put("logoUrl", host.getLogoUrl());
        branding.put("primaryColor", host.getPrimaryColor() != null ? host.getPrimaryColor() : DEFAULT_PRIMARY_COLOR);
        response.put("branding", branding);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/public/subdomain/branding
     * Get branding for the current subdomain (for public pages)
     * Only returns branding if host has verified their email
     *
     * Response (200 OK):
     * {
     *   "logoUrl": "https://...",
     *   "primaryColor": "#FFFF00"
     * }
     *
     * Response when subdomain not found or not verified (404 Not Found):
     * {
     *   "logoUrl": null,
     *   "primaryColor": "#FFFF00"
     * }
     */
    @GetMapping("/branding")
    public ResponseEntity<BrandingResponse> getBranding(HttpServletRequest request) {
        String subdomain = subdomainExtractor.extractSubdomain(request);

        // Return default branding if no subdomain
        if (subdomain == null || subdomain.isEmpty()) {
            return ResponseEntity.ok(new BrandingResponse(null, DEFAULT_PRIMARY_COLOR));
        }

        // Get host branding
        Host host = hostRepository.findBySubdomain(subdomain).orElse(null);

        if (host == null || !host.getEmailVerified()) {
            // Subdomain not found or email not verified
            return ResponseEntity.status(404).body(new BrandingResponse(null, DEFAULT_PRIMARY_COLOR));
        }

        BrandingResponse branding = new BrandingResponse(
            host.getLogoUrl(),
            host.getPrimaryColor() != null ? host.getPrimaryColor() : DEFAULT_PRIMARY_COLOR
        );

        return ResponseEntity.ok(branding);
    }
}