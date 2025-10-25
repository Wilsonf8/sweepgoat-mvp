package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.*;
import com.sweepgoat.backend.exception.DuplicateResourceException;
import com.sweepgoat.backend.exception.EmailNotVerifiedException;
import com.sweepgoat.backend.exception.InvalidCredentialsException;
import com.sweepgoat.backend.exception.InvalidVerificationCodeException;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.model.User;
import com.sweepgoat.backend.repository.HostRepository;
import com.sweepgoat.backend.repository.UserRepository;
import com.sweepgoat.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserAuthService {

    private static final Logger logger = LoggerFactory.getLogger(UserAuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Value("${app.auto-verify-emails:false}")
    private boolean autoVerifyEmails;

    private static final int VERIFICATION_CODE_LENGTH = 6;
    private static final int VERIFICATION_CODE_EXPIRY_HOURS = 24;

    /**
     * Register a new user (can only be done on subdomain)
     * Domain validation should be handled in controller
     */
    @Transactional
    public MessageResponse registerUser(UserRegisterRequest request, String subdomain) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Check if host's email is trying to register as user on their own subdomain
        if (host.getEmail().equalsIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Host cannot register as a user on their own subdomain");
        }

        // Check if user with this email already exists for this host
        // NOTE: Same email can exist on different subdomains (different hosts)
        if (userRepository.existsByEmailAndHostId(request.getEmail(), host.getId())) {
            throw new DuplicateResourceException("A user with this email already exists on this subdomain");
        }

        // Create new user
        User user = new User();
        user.setHost(host);
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmailOptIn(request.getEmailOptIn() != null ? request.getEmailOptIn() : false);
        user.setSmsOptIn(request.getSmsOptIn() != null ? request.getSmsOptIn() : false);
        user.setIsActive(true);

        // Check if auto-verify is enabled (development mode)
        if (autoVerifyEmails) {
            logger.info("Auto-verify enabled: Automatically verifying email for user: {}", request.getEmail());
            user.setEmailVerified(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
        } else {
            // Generate 6-digit verification code
            String verificationCode = generateVerificationCode();
            user.setEmailVerified(false);
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(VERIFICATION_CODE_EXPIRY_HOURS));

            // Send verification email
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        }

        // Save user
        userRepository.save(user);

        // Return appropriate message based on auto-verify setting
        if (autoVerifyEmails) {
            return new MessageResponse("Registration successful! Email automatically verified (dev mode). You can now login.");
        } else {
            return new MessageResponse("Registration successful! Check your email for a 6-digit verification code.");
        }
    }

    /**
     * Authenticate user login
     * If email not verified, throw EmailNotVerifiedException which will be caught by GlobalExceptionHandler
     */
    public UserLoginResponse authenticateUser(UserLoginRequest request, String subdomain) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Find user by email and hostId
        User user = userRepository.findByEmailAndHostId(request.getEmail(), host.getId())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            throw new InvalidCredentialsException("This account has been deactivated");
        }

        // **KEY IMPROVEMENT**: Check if email is verified
        // If not verified, throw special exception that returns emailVerified: false
        if (!user.getEmailVerified()) {
            throw new EmailNotVerifiedException("Please verify your email to continue", user.getEmail());
        }

        // Update last login timestamp
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateUserToken(user.getEmail(), user.getId(), host.getId());

        // Return successful login response
        return new UserLoginResponse(
            token,
            "USER",
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            host.getId(),
            host.getSubdomain()
        );
    }

    /**
     * Verify email with 6-digit code
     */
    @Transactional
    public MessageResponse verifyEmail(VerifyEmailRequest request, String subdomain) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Find user by email and hostId
        User user = userRepository.findByEmailAndHostId(request.getEmail(), host.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already verified
        if (user.getEmailVerified()) {
            return new MessageResponse("Email already verified! You can now login.");
        }

        // Check if verification code matches
        if (!request.getCode().equals(user.getVerificationCode())) {
            throw new InvalidVerificationCodeException("Invalid verification code");
        }

        // Check if verification code has expired
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationCodeException("Verification code has expired. Please request a new one.");
        }

        // Mark email as verified
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);

        return new MessageResponse("Email verified successfully! You can now login.");
    }

    /**
     * Resend verification code
     */
    @Transactional
    public MessageResponse resendVerificationCode(ResendVerificationRequest request, String subdomain) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Find user by email and hostId
        User user = userRepository.findByEmailAndHostId(request.getEmail(), host.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already verified
        if (user.getEmailVerified()) {
            return new MessageResponse("Email already verified! You can now login.");
        }

        // Generate new verification code
        String newVerificationCode = generateVerificationCode();

        // Update user
        user.setVerificationCode(newVerificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(VERIFICATION_CODE_EXPIRY_HOURS));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), newVerificationCode);

        return new MessageResponse("New verification code sent to your email!");
    }

    /**
     * Delete user account (USER auth required)
     */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.delete(user);
    }

    /**
     * Get all users for a host (HOST auth required)
     */
    public java.util.List<UserListResponse> getUsersByHostId(Long hostId) {
        java.util.List<User> users = userRepository.findByHostId(hostId);

        return users.stream()
            .map(user -> new UserListResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getEmailVerified(),
                user.getIsActive(),
                user.getCreatedAt(),
                user.getLastLoginAt()
            ))
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Generate random 6-digit verification code
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Generates 6-digit number
        return String.valueOf(code);
    }
}