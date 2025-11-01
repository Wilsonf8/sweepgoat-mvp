package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.PaginatedResponse;
import com.sweepgoat.backend.dto.UserListResponse;
import com.sweepgoat.backend.service.UserAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class HostUserController {

    @Autowired
    private UserAuthService userAuthService;

    /**
     * GET /api/host/users
     * Get all users registered on the authenticated host's subdomain with pagination
     *
     * Query parameters:
     * - page: page number (0-indexed, default: 0)
     * - size: items per page (default: 50)
     * - sortBy: field to sort by (lastLoginAt, createdAt, email, firstName, lastName)
     * - sortOrder: asc or desc (default: desc)
     * - giveawayId: filter users who entered this giveaway (optional)
     * - emailVerified: filter by email verification status true/false (optional)
     * - emailOptIn: filter by email opt-in status true/false (optional)
     * - smsOptIn: filter by SMS opt-in status true/false (optional)
     *
     * Examples:
     * - /api/host/users
     * - /api/host/users?page=0&size=50
     * - /api/host/users?page=1&size=50&sortBy=lastLoginAt&sortOrder=desc
     * - /api/host/users?page=0&size=25&giveawayId=5
     * - /api/host/users?emailVerified=true&emailOptIn=true
     * - /api/host/users?giveawayId=3&smsOptIn=true&sortBy=lastName
     */
    @GetMapping("/users")
    public ResponseEntity<PaginatedResponse<UserListResponse>> getAllUsers(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) Long giveawayId,
            @RequestParam(required = false) Boolean emailVerified,
            @RequestParam(required = false) Boolean emailOptIn,
            @RequestParam(required = false) Boolean smsOptIn,
            HttpServletRequest request) {
        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        PaginatedResponse<UserListResponse> users = userAuthService.getUsersByHostId(
                hostId, page, size, sortBy, sortOrder, giveawayId, emailVerified, emailOptIn, smsOptIn
        );

        return ResponseEntity.ok(users);
    }
}