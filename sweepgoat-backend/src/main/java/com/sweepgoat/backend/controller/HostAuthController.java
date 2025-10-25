package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.HostLoginRequest;
import com.sweepgoat.backend.dto.HostLoginResponse;
import com.sweepgoat.backend.dto.HostRegisterRequest;
import com.sweepgoat.backend.exception.InvalidDomainException;
import com.sweepgoat.backend.service.HostAuthService;
import com.sweepgoat.backend.util.SubdomainExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/host")
public class HostAuthController {

    @Autowired
    private HostAuthService hostAuthService;

    @Autowired
    private SubdomainExtractor subdomainExtractor;

    /**
     * POST /api/auth/host/register
     * Register a new host (only allowed on main domain: sweepgoat.com)
     */
    @PostMapping("/register")
    public ResponseEntity<HostLoginResponse> register(
            @Valid @RequestBody HostRegisterRequest request,
            HttpServletRequest httpRequest) {

        // Validate that request is from main domain
        if (!subdomainExtractor.isMainDomain(httpRequest)) {
            throw new InvalidDomainException("Host registration is only allowed on the main domain (sweepgoat.com)");
        }

        HostLoginResponse response = hostAuthService.registerHost(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/host/login
     * Login as host (can be done from both main domain and subdomain)
     * - Main domain (sweepgoat.com): Manage subdomains
     * - Subdomain (host1.sweepgoat.com): Access CRM dashboard
     */
    @PostMapping("/login")
    public ResponseEntity<HostLoginResponse> login(
            @Valid @RequestBody HostLoginRequest request) {

        HostLoginResponse response = hostAuthService.authenticateHost(request);
        return ResponseEntity.ok(response);
    }
}