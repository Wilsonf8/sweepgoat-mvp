package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.SendCampaignRequest;
import com.sweepgoat.backend.dto.SendCampaignResponse;
import com.sweepgoat.backend.service.MarketingCampaignService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/host")
public class HostCampaignController {

    @Autowired
    private MarketingCampaignService marketingCampaignService;

    /**
     * POST /api/host/campaigns/send
     * Send marketing campaign to filtered users
     *
     * Request body example:
     * {
     *   "name": "Giveaway Reminder Campaign",
     *   "type": "EMAIL",
     *   "subject": "{{firstName}}, Check Your Status!",
     *   "message": "Hi {{firstName}} {{lastName}},\n\nVisit https://{{subdomain}}.sweepgoat.com\n\nThanks,\n{{hostCompanyName}}",
     *   "giveawayId": 1,
     *   "emailVerified": true,
     *   "emailOptIn": true,
     *   "smsOptIn": null,
     *   "sortBy": "firstName",
     *   "sortOrder": "asc"
     * }
     *
     * Supported template variables:
     * - {{firstName}} - User's first name
     * - {{lastName}} - User's last name
     * - {{hostCompanyName}} - Host's company name
     * - {{subdomain}} - Host's subdomain
     */
    @PostMapping("/campaigns/send")
    public ResponseEntity<SendCampaignResponse> sendCampaign(
            @Valid @RequestBody SendCampaignRequest request,
            HttpServletRequest httpRequest) {

        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) httpRequest.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        SendCampaignResponse response = marketingCampaignService.sendCampaign(request, hostId);

        return ResponseEntity.ok(response);
    }
}