package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.BrandingResponse;
import com.sweepgoat.backend.dto.ChangePasswordRequest;
import com.sweepgoat.backend.dto.HostLoginRequest;
import com.sweepgoat.backend.dto.HostLoginResponse;
import com.sweepgoat.backend.dto.HostRegisterRequest;
import com.sweepgoat.backend.dto.MessageResponse;
import com.sweepgoat.backend.dto.ResendVerificationRequest;
import com.sweepgoat.backend.dto.UpdateBrandingRequest;
import com.sweepgoat.backend.dto.VerifyEmailRequest;
import com.sweepgoat.backend.exception.DuplicateResourceException;
import com.sweepgoat.backend.exception.EmailNotVerifiedException;
import com.sweepgoat.backend.exception.InvalidCredentialsException;
import com.sweepgoat.backend.exception.InvalidVerificationCodeException;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.repository.HostRepository;
import com.sweepgoat.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class HostAuthService {

    private static final Logger logger = LoggerFactory.getLogger(HostAuthService.class);
    private static final String DEFAULT_PRIMARY_COLOR = "#FFFF00"; // Yellow
    private static final int VERIFICATION_CODE_LENGTH = 6;
    private static final int VERIFICATION_CODE_EXPIRY_HOURS = 24;

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SubdomainValidationService subdomainValidationService;

    /**
     * Register a new host (can only be done on main domain: sweepgoat.com)
     * Domain validation should be handled in controller
     * Host must verify email before login
     */
    @Transactional
    public MessageResponse registerHost(HostRegisterRequest request) {
        // Convert email to lowercase for consistency
        String emailLowercase = request.getEmail().toLowerCase().trim();

        // Convert subdomain to lowercase for consistency
        String subdomainLowercase = request.getSubdomain().toLowerCase().trim();

        // Check if email already exists (case-insensitive)
        if (hostRepository.existsByEmail(emailLowercase)) {
            throw new DuplicateResourceException("A host with this email already exists");
        }

        // Check if subdomain already exists (case-insensitive)
        if (hostRepository.existsBySubdomain(subdomainLowercase)) {
            throw new DuplicateResourceException("This subdomain is already taken");
        }

        // Create new host
        Host host = new Host();
        host.setSubdomain(subdomainLowercase);
        host.setCompanyName(request.getCompanyName());
        host.setEmail(emailLowercase);
        host.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        host.setIsActive(true);

        // Generate 6-digit verification code
        String verificationCode = generateVerificationCode();
        host.setEmailVerified(false);
        host.setVerificationCode(verificationCode);
        host.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(VERIFICATION_CODE_EXPIRY_HOURS));

        // Save host
        hostRepository.save(host);

        // Send verification email (logs to console for MVP)
        emailService.sendVerificationEmail(host.getEmail(), verificationCode);

        // Return message (no token - must verify email first)
        return new MessageResponse("Registration successful! Check your email for a 6-digit verification code.");
    }

    /**
     * Authenticate host login with subdomain validation
     *
     * @param request Login credentials (email + password)
     * @param subdomain Subdomain from request (null if main domain)
     * @throws EmailNotVerifiedException if email not verified
     * @throws SubdomainMismatchException if attempting to log in from wrong subdomain
     */
    public HostLoginResponse authenticateHost(HostLoginRequest request, String subdomain) {
        // Convert email to lowercase for consistency
        String emailLowercase = request.getEmail().toLowerCase().trim();

        // Find host by email
        Host host = hostRepository.findByEmail(emailLowercase)
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), host.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Check if host is active
        if (!host.getIsActive()) {
            throw new InvalidCredentialsException("This account has been deactivated");
        }

        // Check if email is verified
        if (!host.getEmailVerified()) {
            throw new EmailNotVerifiedException("Please verify your email to continue", host.getEmail());
        }

        // Validate subdomain matches host's registered subdomain
        // Allow login from main domain (null/empty subdomain) for management purposes
        if (subdomain != null && !subdomain.isEmpty()) {
            if (!subdomain.equals(host.getSubdomain())) {
                throw new com.sweepgoat.backend.exception.SubdomainMismatchException(
                    String.format("Cannot log in from subdomain '%s'. Please log in from '%s.sweepgoat.com' or the main domain.",
                        subdomain, host.getSubdomain()),
                    subdomain,
                    host.getSubdomain()
                );
            }
        }

        // Generate JWT token
        String token = jwtUtil.generateHostToken(host.getEmail(), host.getId());

        // Return response
        return new HostLoginResponse(
            token,
            "HOST",
            host.getId(),
            host.getEmail(),
            host.getSubdomain(),
            host.getCompanyName()
        );
    }

    /**
     * Verify host email with 6-digit code
     */
    @Transactional
    public MessageResponse verifyHostEmail(VerifyEmailRequest request) {
        // Convert email to lowercase for consistency
        String emailLowercase = request.getEmail().toLowerCase().trim();

        // Find host by email
        Host host = hostRepository.findByEmail(emailLowercase)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Check if already verified
        if (host.getEmailVerified()) {
            return new MessageResponse("Email is already verified");
        }

        // Check if verification code matches
        if (!request.getCode().equals(host.getVerificationCode())) {
            throw new InvalidVerificationCodeException("Invalid verification code");
        }

        // Check if verification code has expired
        if (host.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationCodeException("Verification code has expired. Please request a new one.");
        }

        // Mark email as verified
        host.setEmailVerified(true);
        host.setVerificationCode(null);
        host.setVerificationCodeExpiresAt(null);
        hostRepository.save(host);

        // Invalidate subdomain cache so the subdomain becomes immediately accessible
        subdomainValidationService.invalidateSubdomainCache(host.getSubdomain());

        return new MessageResponse("Email verified successfully! You can now log in.");
    }

    /**
     * Resend verification code to host's email
     */
    @Transactional
    public MessageResponse resendHostVerificationCode(ResendVerificationRequest request) {
        // Convert email to lowercase for consistency
        String emailLowercase = request.getEmail().toLowerCase().trim();

        // Find host by email
        Host host = hostRepository.findByEmail(emailLowercase)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Check if already verified
        if (host.getEmailVerified()) {
            return new MessageResponse("Email is already verified");
        }

        // Generate new verification code
        String verificationCode = generateVerificationCode();
        host.setVerificationCode(verificationCode);
        host.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(VERIFICATION_CODE_EXPIRY_HOURS));
        hostRepository.save(host);

        // Send verification email
        emailService.sendVerificationEmail(host.getEmail(), verificationCode);

        return new MessageResponse("Verification code sent! Check your email.");
    }

    /**
     * Generate a random 6-digit verification code
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Generates number between 100000-999999
        return String.valueOf(code);
    }

    /**
     * Get host by ID
     */
    public Host getHostById(Long hostId) {
        return hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));
    }

    /**
     * Get host by subdomain
     */
    public Host getHostBySubdomain(String subdomain) {
        return hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found for subdomain: " + subdomain));
    }

    /**
     * Delete host account (HOST auth required)
     * WARNING: This will cascade delete all giveaways and users for this host!
     */
    @Transactional
    public void deleteHost(Long hostId) {
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        hostRepository.delete(host);
    }

    /**
     * Change host password (HOST auth required)
     */
    @Transactional
    public MessageResponse changePassword(Long hostId, ChangePasswordRequest request) {
        // Find host
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), host.getPasswordHash())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        // Check that new password is different from current
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new InvalidCredentialsException("New password must be different from current password");
        }

        // Update password
        host.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        hostRepository.save(host);

        return new MessageResponse("Password changed successfully!");
    }

    /**
     * Update host branding (company name, logo, and/or primary color)
     * Validates logo URL accessibility if provided
     */
    @Transactional
    public BrandingResponse updateBranding(UpdateBrandingRequest request, Long hostId) {
        // Find host
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Update company name if provided
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            host.setCompanyName(request.getCompanyName().trim());
        }

        // Update logo URL if provided
        if (request.getLogoUrl() != null) {
            // Validate URL accessibility
            if (!isUrlAccessible(request.getLogoUrl())) {
                throw new IllegalArgumentException("Logo URL is not accessible: " + request.getLogoUrl());
            }
            host.setLogoUrl(request.getLogoUrl());
        }

        // Update primary color if provided (validation already handled by @Pattern annotation)
        if (request.getPrimaryColor() != null) {
            host.setPrimaryColor(request.getPrimaryColor());
        }

        // Save updated host
        host = hostRepository.save(host);

        // Return updated branding
        return new BrandingResponse(
            host.getLogoUrl(),
            host.getPrimaryColor() != null ? host.getPrimaryColor() : DEFAULT_PRIMARY_COLOR
        );
    }

    /**
     * Get current branding settings for a host
     * Returns default yellow color if no color is set
     */
    public BrandingResponse getBranding(Long hostId) {
        // Find host
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Return branding with default color if not set
        return new BrandingResponse(
            host.getLogoUrl(),
            host.getPrimaryColor() != null ? host.getPrimaryColor() : DEFAULT_PRIMARY_COLOR
        );
    }

    /**
     * Validate URL accessibility by making a HEAD request
     * Returns true if the URL responds with 2xx or 3xx status code
     */
    private boolean isUrlAccessible(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(5000); // 5 second timeout
            connection.setReadTimeout(5000);

            int responseCode = connection.getResponseCode();
            connection.disconnect();

            // Consider 2xx and 3xx as successful
            return responseCode >= 200 && responseCode < 400;

        } catch (IOException e) {
            logger.warn("URL accessibility check failed for {}: {}", urlString, e.getMessage());
            return false;
        }
    }
}