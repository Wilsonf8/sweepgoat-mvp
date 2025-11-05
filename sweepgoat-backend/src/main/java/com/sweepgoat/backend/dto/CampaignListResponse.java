package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignListResponse {

    private Long id;
    private String name;
    private String type; // EMAIL, SMS, BOTH
    private String subject;
    private String status; // DRAFT, SCHEDULED, SENDING, SENT, CANCELLED
    private Integer totalRecipients;
    private Integer totalSent;
    private Integer totalFailed;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
}