package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.GiveawayEntryRequest;
import com.sweepgoat.backend.dto.GiveawayEntryResponse;
import com.sweepgoat.backend.dto.MessageResponse;
import com.sweepgoat.backend.dto.UserEntryResponse;
import com.sweepgoat.backend.service.GiveawayEntryService;
import com.sweepgoat.backend.service.UserAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
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
     * POST /api/user/giveaways/{id}/enter
     * Enter a giveaway (MVP: free entry only)
     */
    @PostMapping("/giveaways/{id}/enter")
    public ResponseEntity<GiveawayEntryResponse> enterGiveaway(
            @PathVariable Long id,
            @RequestBody(required = false) GiveawayEntryRequest request,
            HttpServletRequest httpRequest) {

        // Extract userId from JWT (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }

        // For MVP, we only support free entries
        // Future: Use request.getIsFreeEntry() to determine entry type
        GiveawayEntryResponse response = giveawayEntryService.enterGiveawayForFree(id, userId);

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