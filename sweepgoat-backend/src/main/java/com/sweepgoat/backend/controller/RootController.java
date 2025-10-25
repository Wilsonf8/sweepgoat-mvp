package com.sweepgoat.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("name", "Sweepgoat API");
        response.put("version", "1.0.0 MVP");
        response.put("status", "running");

        // Organize endpoints by category
        Map<String, Object> endpoints = new HashMap<>();

        // Authentication endpoints
        Map<String, String> authEndpoints = new HashMap<>();
        authEndpoints.put("Host Registration", "POST /api/auth/host/register");
        authEndpoints.put("Host Login", "POST /api/auth/host/login");
        authEndpoints.put("User Registration", "POST /api/auth/user/register");
        authEndpoints.put("User Login", "POST /api/auth/user/login");
        authEndpoints.put("Verify Email", "POST /api/auth/user/verify-email");
        authEndpoints.put("Resend Verification", "POST /api/auth/user/resend-verification");
        endpoints.put("authentication", authEndpoints);

        // Public endpoints (no auth required)
        Map<String, String> publicEndpoints = new HashMap<>();
        publicEndpoints.put("List Giveaways", "GET /api/public/giveaways");
        publicEndpoints.put("Get Giveaway Details", "GET /api/public/giveaways/{id}");
        endpoints.put("public", publicEndpoints);

        // User endpoints (USER auth required)
        Map<String, String> userEndpoints = new HashMap<>();
        userEndpoints.put("View My Entries", "GET /api/user/my-entries");
        userEndpoints.put("Enter Giveaway", "POST /api/user/giveaways/{id}/enter");
        userEndpoints.put("Delete My Account", "DELETE /api/user/account");
        endpoints.put("user", userEndpoints);

        // Host endpoints (HOST auth required)
        Map<String, String> hostEndpoints = new HashMap<>();
        hostEndpoints.put("List My Giveaways", "GET /api/host/giveaways");
        hostEndpoints.put("List Active Giveaways", "GET /api/host/giveaways/active");
        hostEndpoints.put("Get Giveaway Details", "GET /api/host/giveaways/{id}");
        hostEndpoints.put("Get Giveaway Stats", "GET /api/host/giveaways/{id}/stats");
        hostEndpoints.put("View Leaderboard", "GET /api/host/giveaways/{id}/entries");
        hostEndpoints.put("Create Giveaway", "POST /api/host/giveaways");
        hostEndpoints.put("Delete Giveaway", "DELETE /api/host/giveaways/{id}");
        hostEndpoints.put("View All Users", "GET /api/host/users?sortBy={field}&sortOrder={asc|desc}");
        hostEndpoints.put("Delete My Account", "DELETE /api/host/account");
        endpoints.put("host", hostEndpoints);

        // Utility endpoints
        Map<String, String> utilityEndpoints = new HashMap<>();
        utilityEndpoints.put("Health Check", "GET /health");
        utilityEndpoints.put("API Info", "GET /");
        endpoints.put("utility", utilityEndpoints);

        response.put("endpoints", endpoints);

        // Add notes
        Map<String, String> notes = new HashMap<>();
        notes.put("subdomain", "Include X-Subdomain header for subdomain-specific requests");
        notes.put("authentication", "Include Authorization: Bearer {token} header for protected endpoints");
        notes.put("user_sorting", "GET /api/host/users supports sorting by: lastLoginAt, createdAt, email, firstName, lastName (default: createdAt desc)");
        response.put("notes", notes);

        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }
}