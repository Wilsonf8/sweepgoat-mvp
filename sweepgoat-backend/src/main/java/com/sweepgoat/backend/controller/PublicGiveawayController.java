package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.GiveawayDetailsResponse;
import com.sweepgoat.backend.dto.GiveawayListResponse;
import com.sweepgoat.backend.dto.PaginatedResponse;
import com.sweepgoat.backend.service.GiveawayService;
import com.sweepgoat.backend.util.SubdomainExtractor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/giveaways")
public class PublicGiveawayController {

    @Autowired
    private GiveawayService giveawayService;

    @Autowired
    private SubdomainExtractor subdomainExtractor;

    /**
     * GET /api/public/giveaways
     * List giveaways on the subdomain with pagination and optional status filter (no auth required)
     *
     * Query params:
     * - page: Page number (default: 0)
     * - size: Items per page (default: 5)
     * - status: Filter by status - "ACTIVE", "ENDED", "CANCELLED" (optional, omit for all)
     *
     * Examples:
     * - GET /api/public/giveaways?page=0&size=5 (first page, all giveaways)
     * - GET /api/public/giveaways?page=1&size=5&status=ENDED (second page, ended giveaways only)
     */
    @GetMapping
    public ResponseEntity<PaginatedResponse<GiveawayListResponse>> getAllGiveaways(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String status) {

        String subdomain = subdomainExtractor.extractSubdomain(request);
        Pageable pageable = PageRequest.of(page, size);

        PaginatedResponse<GiveawayListResponse> giveaways =
            giveawayService.getGiveawaysBySubdomain(subdomain, status, pageable);

        return ResponseEntity.ok(giveaways);
    }

    /**
     * GET /api/public/giveaways/{id}
     * Get details for a specific giveaway (no auth required)
     */
    @GetMapping("/{id}")
    public ResponseEntity<GiveawayDetailsResponse> getGiveawayById(
            @PathVariable Long id,
            HttpServletRequest request) {

        String subdomain = subdomainExtractor.extractSubdomain(request);

        GiveawayDetailsResponse giveaway = giveawayService.getGiveawayById(id, subdomain);

        return ResponseEntity.ok(giveaway);
    }
}