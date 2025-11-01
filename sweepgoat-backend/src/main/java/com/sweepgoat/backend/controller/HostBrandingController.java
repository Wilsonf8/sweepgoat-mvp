package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.BrandingResponse;
import com.sweepgoat.backend.dto.UpdateBrandingRequest;
import com.sweepgoat.backend.service.HostAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/host")
public class HostBrandingController {

    @Autowired
    private HostAuthService hostAuthService;

    /**
     * PATCH /api/host/branding
     * Update host branding (logo and/or primary color)
     *
     * Request body (all fields optional):
     * {
     *   "logoUrl": "https://imagedelivery.net/...",
     *   "primaryColor": "#FFFF00"
     * }
     *
     * Requires HOST authentication
     */
    @PatchMapping("/branding")
    public ResponseEntity<BrandingResponse> updateBranding(
            @Valid @RequestBody UpdateBrandingRequest request,
            HttpServletRequest httpRequest) {

        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) httpRequest.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        BrandingResponse response = hostAuthService.updateBranding(request, hostId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/host/branding
     * Get current branding settings for the authenticated host
     *
     * Returns default yellow (#FFFF00) if no primary color is set
     *
     * Requires HOST authentication
     */
    @GetMapping("/branding")
    public ResponseEntity<BrandingResponse> getBranding(HttpServletRequest httpRequest) {

        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) httpRequest.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        BrandingResponse response = hostAuthService.getBranding(hostId);
        return ResponseEntity.ok(response);
    }
}