package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Full giveaway details with entry information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayDetailsResponse {

    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status; // ACTIVE, ENDED, CANCELLED
    private Long hostId;
    private String subdomain;
    private Long totalEntries; // Total number of users who entered
    private LocalDateTime createdAt;
}