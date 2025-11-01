package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.BrandingResponse;
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

    /**
     * Register a new host (can only be done on main domain: sweepgoat.com)
     * Domain validation should be handled in controller
     * Host must verify email before login
     */
    @Transactional
    public MessageResponse registerHost(HostRegisterRequest request) {
        // Check if email already exists
        if (hostRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A host with this email already exists");
        }

        // Check if subdomain already exists
        if (hostRepository.existsBySubdomain(request.getSubdomain())) {
            throw new DuplicateResourceException("This subdomain is already taken");
        }

        // Create new host
        Host host = new Host();
        host.setSubdomain(request.getSubdomain());
        host.setCompanyName(request.getCompanyName());
        host.setEmail(request.getEmail());
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
     * Authenticate host login
     * Throws EmailNotVerifiedException if email not verified
     */
    public HostLoginResponse authenticateHost(HostLoginRequest request) {
        // Find host by email
        Host host = hostRepository.findByEmail(request.getEmail())
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
        // Find host by email
        Host host = hostRepository.findByEmail(request.getEmail())
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

        return new MessageResponse("Email verified successfully! You can now log in.");
    }

    /**
     * Resend verification code to host's email
     */
    @Transactional
    public MessageResponse resendHostVerificationCode(ResendVerificationRequest request) {
        // Find host by email
        Host host = hostRepository.findByEmail(request.getEmail())
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
     * Update host branding (logo and/or primary color)
     * Validates logo URL accessibility if provided
     */
    @Transactional
    public BrandingResponse updateBranding(UpdateBrandingRequest request, Long hostId) {
        // Find host
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

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