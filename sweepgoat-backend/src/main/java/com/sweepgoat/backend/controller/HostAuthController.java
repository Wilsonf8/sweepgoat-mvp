package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.HostLoginRequest;
import com.sweepgoat.backend.dto.HostLoginResponse;
import com.sweepgoat.backend.dto.HostRegisterRequest;
import com.sweepgoat.backend.dto.MessageResponse;
import com.sweepgoat.backend.dto.ResendVerificationRequest;
import com.sweepgoat.backend.dto.VerifyEmailRequest;
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
     * Returns a message - host must verify email before login
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(
            @Valid @RequestBody HostRegisterRequest request,
            HttpServletRequest httpRequest) {

        // Validate that request is from main domain
        if (!subdomainExtractor.isMainDomain(httpRequest)) {
            throw new InvalidDomainException("Host registration is only allowed on the main domain (sweepgoat.com)");
        }

        MessageResponse response = hostAuthService.registerHost(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/host/login
     * Login as host with subdomain validation
     *
     * Hosts can log in from:
     * - Their own subdomain (e.g., acme host at acme.sweepgoat.com)
     * - Main domain (sweepgoat.com) - for management/flexibility
     *
     * Hosts CANNOT log in from other hosts' subdomains (security)
     *
     * Throws EmailNotVerifiedException if email not verified
     * Throws SubdomainMismatchException if attempting to log in from wrong subdomain
     */
    @PostMapping("/login")
    public ResponseEntity<HostLoginResponse> login(
            @Valid @RequestBody HostLoginRequest request,
            HttpServletRequest httpRequest) {

        // Extract subdomain from request (null if main domain)
        String subdomain = subdomainExtractor.extractSubdomain(httpRequest);

        HostLoginResponse response = hostAuthService.authenticateHost(request, subdomain);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/host/verify-email
     * Verify host email with 6-digit code sent during registration
     */
    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {

        MessageResponse response = hostAuthService.verifyHostEmail(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/host/resend-verification
     * Resend verification code to host's email
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {

        MessageResponse response = hostAuthService.resendHostVerificationCode(request);
        return ResponseEntity.ok(response);
    }
}