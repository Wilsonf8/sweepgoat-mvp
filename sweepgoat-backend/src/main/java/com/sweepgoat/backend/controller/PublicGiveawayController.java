package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.GiveawayDetailsResponse;
import com.sweepgoat.backend.dto.GiveawayListResponse;
import com.sweepgoat.backend.service.GiveawayService;
import com.sweepgoat.backend.util.SubdomainExtractor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
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
     * List all active giveaways on the subdomain (no auth required)
     */
    @GetMapping
    public ResponseEntity<List<GiveawayListResponse>> getAllGiveaways(HttpServletRequest request) {
        String subdomain = subdomainExtractor.extractSubdomain(request);

        List<GiveawayListResponse> giveaways = giveawayService.getAllActiveGiveawaysBySubdomain(subdomain);

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