package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.CreateGiveawayRequest;
import com.sweepgoat.backend.dto.GiveawayDetailsResponse;
import com.sweepgoat.backend.dto.GiveawayEntryLeaderboardResponse;
import com.sweepgoat.backend.dto.GiveawayListResponse;
import com.sweepgoat.backend.dto.GiveawayStatsResponse;
import com.sweepgoat.backend.dto.MessageResponse;
import com.sweepgoat.backend.dto.WinnerSelectionResponse;
import com.sweepgoat.backend.service.GiveawayEntryService;
import com.sweepgoat.backend.service.GiveawayService;
import com.sweepgoat.backend.service.HostAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host/giveaways")
public class HostGiveawayController {

    @Autowired
    private GiveawayService giveawayService;

    @Autowired
    private GiveawayEntryService giveawayEntryService;

    @Autowired
    private HostAuthService hostAuthService;

    /**
     * GET /api/host/giveaways
     * Get all giveaways created by the authenticated host
     */
    @GetMapping
    public ResponseEntity<List<GiveawayListResponse>> getAllMyGiveaways(HttpServletRequest request) {
        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        List<GiveawayListResponse> giveaways = giveawayService.getGiveawaysByHostId(hostId);

        return ResponseEntity.ok(giveaways);
    }

    /**
     * GET /api/host/giveaways/{id}
     * Get details for a specific giveaway owned by the host
     */
    @GetMapping("/{id}")
    public ResponseEntity<GiveawayDetailsResponse> getMyGiveawayById(
            @PathVariable Long id,
            HttpServletRequest request) {

        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        GiveawayDetailsResponse giveaway = giveawayService.getHostGiveawayById(id, hostId);

        return ResponseEntity.ok(giveaway);
    }

    /**
     * GET /api/host/giveaways/{id}/stats
     * Get statistics for a specific giveaway
     */
    @GetMapping("/{id}/stats")
    public ResponseEntity<GiveawayStatsResponse> getGiveawayStats(
            @PathVariable Long id,
            HttpServletRequest request) {

        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        GiveawayStatsResponse stats = giveawayService.getGiveawayStats(id, hostId);

        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/host/giveaways/{id}/entries
     * Get all entries (leaderboard) for a specific giveaway
     */
    @GetMapping("/{id}/entries")
    public ResponseEntity<List<GiveawayEntryLeaderboardResponse>> getGiveawayEntries(
            @PathVariable Long id,
            HttpServletRequest request) {

        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        List<GiveawayEntryLeaderboardResponse> entries = giveawayEntryService.getEntriesForGiveaway(id, hostId);

        return ResponseEntity.ok(entries);
    }

    /**
     * GET /api/host/giveaways/active
     * Get only active giveaways for the authenticated host
     */
    @GetMapping("/active")
    public ResponseEntity<List<GiveawayListResponse>> getActiveGiveaways(HttpServletRequest request) {
        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        List<GiveawayListResponse> giveaways = giveawayService.getActiveGiveawaysByHostId(hostId);

        return ResponseEntity.ok(giveaways);
    }

    /**
     * POST /api/host/giveaways
     * Create a new giveaway
     */
    @PostMapping
    public ResponseEntity<GiveawayDetailsResponse> createGiveaway(
            @Valid @RequestBody CreateGiveawayRequest request,
            HttpServletRequest httpRequest) {

        Long hostId = (Long) httpRequest.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        GiveawayDetailsResponse giveaway = giveawayService.createGiveaway(request, hostId);

        return ResponseEntity.status(HttpStatus.CREATED).body(giveaway);
    }

    /**
     * DELETE /api/host/giveaways/{id}
     * Delete a giveaway
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteGiveaway(
            @PathVariable Long id,
            HttpServletRequest request) {

        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        giveawayService.deleteGiveaway(id, hostId);

        return ResponseEntity.ok(new MessageResponse("Giveaway deleted successfully"));
    }

    /**
     * POST /api/host/giveaways/{id}/select-winner
     * Randomly select a winner for a giveaway that has ended
     * Uses SecureRandom to ensure fair selection
     * Allows re-selection if a winner was already chosen
     */
    @PostMapping("/{id}/select-winner")
    public ResponseEntity<WinnerSelectionResponse> selectWinner(
            @PathVariable Long id,
            HttpServletRequest request) {

        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        WinnerSelectionResponse winner = giveawayService.selectWinner(id, hostId);

        return ResponseEntity.ok(winner);
    }
}