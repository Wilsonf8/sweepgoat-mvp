package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.ChangePasswordRequest;
import com.sweepgoat.backend.dto.GiveawayEntryRequest;
import com.sweepgoat.backend.dto.GiveawayEntryResponse;
import com.sweepgoat.backend.dto.MessageResponse;
import com.sweepgoat.backend.dto.PaginatedResponse;
import com.sweepgoat.backend.dto.UserEntryResponse;
import com.sweepgoat.backend.dto.UserGiveawayEntryResponse;
import com.sweepgoat.backend.service.GiveawayEntryService;
import com.sweepgoat.backend.service.UserAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserGiveawayController {

    @Autowired
    private GiveawayEntryService giveawayEntryService;

    @Autowired
    private UserAuthService userAuthService;

    /**
     * POST /api/user/giveaways/{id}/enter/free
     * Claim one-time free entry (1 point)
     *
     * - Always worth 1 point
     * - Can only be claimed once per user per giveaway
     * - Sets freeEntryClaimed = true
     * - No request body needed
     */
    @PostMapping("/giveaways/{id}/enter/free")
    public ResponseEntity<GiveawayEntryResponse> claimFreeEntry(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        GiveawayEntryResponse response = giveawayEntryService.claimFreeEntry(id, userId);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/user/giveaways/{id}/enter
     * Add regular entries (variable points)
     *
     * - Variable points based on request body
     * - Can be used multiple times
     * - Does NOT affect freeEntryClaimed status
     * - Future: Will require payment/points purchase
     *
     * NOTE: This endpoint is a stub for future implementation
     */
    @PostMapping("/giveaways/{id}/enter")
    public ResponseEntity<GiveawayEntryResponse> addRegularEntries(
            @PathVariable Long id,
            @RequestBody GiveawayEntryRequest request,
            HttpServletRequest httpRequest) {

        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        // TODO: Implement regular entry logic
        // This is a placeholder for future payment/points system integration
        GiveawayEntryResponse response = giveawayEntryService.addRegularEntries(id, userId, request.getPointsToAdd());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/user/my-entries
     * Get all giveaway entries for the authenticated user
     */
    @GetMapping("/my-entries")
    public ResponseEntity<List<UserEntryResponse>> getMyEntries(HttpServletRequest request) {
        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        List<UserEntryResponse> entries = giveawayEntryService.getUserEntries(userId);

        return ResponseEntity.ok(entries);
    }

    /**
     * GET /api/user/my-giveaway-entries
     * Get user's giveaway entry history with pagination
     *
     * Returns all giveaways the user has entered (current and past)
     * Sorted by giveaway end date descending (most recent first)
     *
     * Query Parameters:
     * - page: Page number (0-indexed, default: 0)
     * - size: Page size (default: 5)
     */
    @GetMapping("/my-giveaway-entries")
    public ResponseEntity<PaginatedResponse<UserGiveawayEntryResponse>> getMyGiveawayEntries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            HttpServletRequest request) {

        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        // Create pageable object
        Pageable pageable = PageRequest.of(page, size);

        // Get paginated entries
        PaginatedResponse<UserGiveawayEntryResponse> response =
            giveawayEntryService.getUserGiveawayEntries(userId, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/user/change-password
     * Change the authenticated user's password
     */
    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {

        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        MessageResponse response = userAuthService.changePassword(userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/user/account
     * Delete the authenticated user's account
     * WARNING: This will delete all user data including giveaway entries!
     */
    @DeleteMapping("/account")
    public ResponseEntity<MessageResponse> deleteAccount(HttpServletRequest request) {
        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        userAuthService.deleteUser(userId);

        return ResponseEntity.ok(new MessageResponse("Account deleted successfully"));
    }
}