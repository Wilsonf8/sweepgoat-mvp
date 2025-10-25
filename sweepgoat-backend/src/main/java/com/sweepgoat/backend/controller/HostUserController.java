package com.sweepgoat.backend.controller;

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
     * Get all users registered on the authenticated host's subdomain
     *
     * Query parameters:
     * - sortBy: field to sort by (lastLoginAt, createdAt, email, firstName, lastName)
     * - sortOrder: asc or desc (default: desc)
     *
     * Examples:
     * - /api/host/users
     * - /api/host/users?sortBy=lastLoginAt&sortOrder=desc
     * - /api/host/users?sortBy=email&sortOrder=asc
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserListResponse>> getAllUsers(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            HttpServletRequest request) {
        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        List<UserListResponse> users = userAuthService.getUsersByHostId(hostId, sortBy, sortOrder);

        return ResponseEntity.ok(users);
    }
}