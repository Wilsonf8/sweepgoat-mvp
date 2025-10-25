package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.*;
import com.sweepgoat.backend.exception.InvalidDomainException;
import com.sweepgoat.backend.service.UserAuthService;
import com.sweepgoat.backend.util.SubdomainExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/user")
public class UserAuthController {

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private SubdomainExtractor subdomainExtractor;

    /**
     * POST /api/auth/user/register
     * Register a new user (only allowed on subdomain: host1.sweepgoat.com)
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(
            @Valid @RequestBody UserRegisterRequest request,
            HttpServletRequest httpRequest) {

        // Validate that request is from subdomain
        if (!subdomainExtractor.isSubdomain(httpRequest)) {
            throw new InvalidDomainException("User registration is only allowed on subdomains");
        }

        // Extract subdomain
        String subdomain = subdomainExtractor.extractSubdomain(httpRequest);

        MessageResponse response = userAuthService.registerUser(request, subdomain);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/user/login
     * Login as user (only allowed on subdomain)
     *
     * Returns either:
     * - UserLoginResponse with JWT token if email is verified
     * - LoginResponseUnverified with emailVerified: false if email not verified
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody UserLoginRequest request,
            HttpServletRequest httpRequest) {

        // Validate that request is from subdomain
        if (!subdomainExtractor.isSubdomain(httpRequest)) {
            throw new InvalidDomainException("User login is only allowed on subdomains");
        }

        // Extract subdomain
        String subdomain = subdomainExtractor.extractSubdomain(httpRequest);

        // If email not verified, EmailNotVerifiedException will be thrown
        // and caught by GlobalExceptionHandler, which returns LoginResponseUnverified
        UserLoginResponse response = userAuthService.authenticateUser(request, subdomain);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/user/verify-email
     * Verify email with 6-digit code
     */
    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request,
            HttpServletRequest httpRequest) {

        // Validate that request is from subdomain
        if (!subdomainExtractor.isSubdomain(httpRequest)) {
            throw new InvalidDomainException("Email verification is only allowed on subdomains");
        }

        // Extract subdomain
        String subdomain = subdomainExtractor.extractSubdomain(httpRequest);

        MessageResponse response = userAuthService.verifyEmail(request, subdomain);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/user/resend-verification
     * Resend verification code
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request,
            HttpServletRequest httpRequest) {

        // Validate that request is from subdomain
        if (!subdomainExtractor.isSubdomain(httpRequest)) {
            throw new InvalidDomainException("Resend verification is only allowed on subdomains");
        }

        // Extract subdomain
        String subdomain = subdomainExtractor.extractSubdomain(httpRequest);

        MessageResponse response = userAuthService.resendVerificationCode(request, subdomain);
        return ResponseEntity.ok(response);
    }
}