package com.sweepgoat.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweepgoat.backend.dto.SendCampaignRequest;
import com.sweepgoat.backend.dto.SendCampaignResponse;
import com.sweepgoat.backend.dto.UserListResponse;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Campaign;
import com.sweepgoat.backend.model.CampaignLog;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.model.User;
import com.sweepgoat.backend.repository.CampaignLogRepository;
import com.sweepgoat.backend.repository.CampaignRepository;
import com.sweepgoat.backend.repository.HostRepository;
import com.sweepgoat.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MarketingCampaignService {

    private static final Logger logger = LoggerFactory.getLogger(MarketingCampaignService.class);

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private CampaignLogRepository campaignLogRepository;

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAuthService userAuthService;

    /**
     * Send marketing campaign to filtered users
     * Supports EMAIL type for MVP (SMS can be added later)
     * Fetches ALL users matching criteria (paginated internally if needed)
     */
    @Transactional
    public SendCampaignResponse sendCampaign(SendCampaignRequest request, Long hostId) {
        // Get host
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Get ALL filtered users (use large page size to get all at once)
        // For campaigns, we need all users, not paginated results
        List<UserListResponse> userListResponses = userAuthService.getUsersByHostId(
            hostId,
            0,           // page 0
            10000,       // large page size to get all users (campaigns need everyone)
            request.getSortBy(),
            request.getSortOrder(),
            request.getGiveawayId(),
            request.getEmailVerified(),
            request.getEmailOptIn(),
            request.getSmsOptIn()
        ).getData();  // Extract data from PaginatedResponse

        // Create campaign record with SENDING status
        Campaign campaign = new Campaign();
        campaign.setHost(host);
        campaign.setName(request.getName());
        campaign.setType(request.getType());
        campaign.setSubject(request.getSubject());
        campaign.setMessage(request.getMessage());
        campaign.setStatus("SENDING");
        campaign.setTotalRecipients(userListResponses.size());
        campaign.setTotalSent(0);
        campaign.setTotalFailed(0);

        // Set targetType based on filters
        if (request.getGiveawayId() != null) {
            campaign.setTargetType("SPECIFIC_GIVEAWAY");
        } else {
            campaign.setTargetType("ALL_USERS");
        }

        // Build and store filters as JSON
        campaign.setFiltersJson(buildFiltersJson(request));

        // Save campaign
        campaign = campaignRepository.save(campaign);

        // Counters for tracking
        int successCount = 0;
        int failCount = 0;

        // Send to each user
        for (UserListResponse userResponse : userListResponses) {
            try {
                // Get full user entity for campaign log
                User user = userRepository.findById(userResponse.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                // Replace template variables in subject and message
                String personalizedSubject = replaceVariables(request.getSubject(), user, host);
                String personalizedMessage = replaceVariables(request.getMessage(), user, host);

                // Send email (console logging for MVP)
                sendEmail(user.getEmail(), personalizedSubject, personalizedMessage);

                // Create campaign log record
                CampaignLog log = new CampaignLog();
                log.setCampaign(campaign);
                log.setUser(user);
                log.setType("EMAIL");
                log.setStatus("SENT");
                log.setSentAt(LocalDateTime.now());
                campaignLogRepository.save(log);

                successCount++;

            } catch (Exception e) {
                logger.error("Failed to send campaign to user {}: {}", userResponse.getEmail(), e.getMessage());
                failCount++;
            }
        }

        // Update campaign with final stats
        campaign.setTotalSent(successCount);
        campaign.setTotalFailed(failCount);
        campaign.setSentAt(LocalDateTime.now());
        campaign.setStatus("SENT");
        campaignRepository.save(campaign);

        // Return response
        return new SendCampaignResponse(
            campaign.getId(),
            campaign.getName(),
            campaign.getType(),
            campaign.getTotalRecipients(),
            successCount,
            failCount,
            campaign.getSentAt(),
            "SENT",
            String.format("Campaign sent successfully to %d users", successCount)
        );
    }

    /**
     * Replace template variables in text
     * Supports: {{firstName}}, {{lastName}}, {{hostCompanyName}}, {{subdomain}}
     */
    private String replaceVariables(String text, User user, Host host) {
        if (text == null) {
            return null;
        }

        return text
            .replace("{{firstName}}", user.getFirstName() != null ? user.getFirstName() : "")
            .replace("{{lastName}}", user.getLastName() != null ? user.getLastName() : "")
            .replace("{{hostCompanyName}}", host.getCompanyName() != null ? host.getCompanyName() : "")
            .replace("{{subdomain}}", host.getSubdomain() != null ? host.getSubdomain() : "");
    }

    /**
     * Send email (console logging for MVP)
     * Easy to swap with SendGrid/AWS SES later
     */
    private void sendEmail(String to, String subject, String body) {
        logger.info("=== MARKETING EMAIL ===");
        logger.info("To: {}", to);
        logger.info("Subject: {}", subject);
        logger.info("Body: {}", body);
        logger.info("=======================");
    }

    /**
     * Build filters JSON string for storage
     */
    private String buildFiltersJson(SendCampaignRequest request) {
        try {
            Map<String, Object> filters = new HashMap<>();

            if (request.getGiveawayId() != null) {
                filters.put("giveawayId", request.getGiveawayId());
            }
            if (request.getEmailVerified() != null) {
                filters.put("emailVerified", request.getEmailVerified());
            }
            if (request.getEmailOptIn() != null) {
                filters.put("emailOptIn", request.getEmailOptIn());
            }
            if (request.getSmsOptIn() != null) {
                filters.put("smsOptIn", request.getSmsOptIn());
            }
            if (request.getSortBy() != null) {
                filters.put("sortBy", request.getSortBy());
            }
            if (request.getSortOrder() != null) {
                filters.put("sortOrder", request.getSortOrder());
            }

            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(filters);

        } catch (Exception e) {
            logger.error("Failed to build filters JSON: {}", e.getMessage());
            return "{}";
        }
    }
}