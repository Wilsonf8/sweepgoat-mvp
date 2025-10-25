package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.HostLoginRequest;
import com.sweepgoat.backend.dto.HostLoginResponse;
import com.sweepgoat.backend.dto.HostRegisterRequest;
import com.sweepgoat.backend.exception.DuplicateResourceException;
import com.sweepgoat.backend.exception.InvalidCredentialsException;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.repository.HostRepository;
import com.sweepgoat.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HostAuthService {

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register a new host (can only be done on main domain: sweepgoat.com)
     * Domain validation should be handled in controller
     */
    @Transactional
    public HostLoginResponse registerHost(HostRegisterRequest request) {
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

        // Save host
        host = hostRepository.save(host);

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
     * Authenticate host login
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
}