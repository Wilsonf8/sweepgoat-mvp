package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendCampaignResponse {

    private Long campaignId;
    private String name;
    private String type; // EMAIL, SMS, BOTH
    private Integer totalRecipients;
    private Integer totalSent;
    private Integer totalFailed;
    private LocalDateTime sentAt;
    private String status; // SENT, SENDING, FAILED
    private String message; // Success/error message
}