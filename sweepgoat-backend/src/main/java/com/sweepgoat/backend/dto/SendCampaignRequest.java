package com.sweepgoat.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendCampaignRequest {

    @NotBlank(message = "Campaign name is required")
    private String name;

    @NotBlank(message = "Campaign type is required")
    private String type; // EMAIL, SMS, BOTH

    private String subject; // Required for EMAIL type

    @NotBlank(message = "Message content is required")
    private String message;

    // Filter parameters
    private Long giveawayId; // Optional: filter by giveaway participants
    private Boolean emailVerified; // Optional: filter by email verification status
    private Boolean emailOptIn; // Optional: filter by email opt-in
    private Boolean smsOptIn; // Optional: filter by SMS opt-in

    // Sorting parameters
    private String sortBy; // firstName, lastName, email, createdAt, lastLoginAt
    private String sortOrder; // asc, desc
}