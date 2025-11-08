package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Simplified giveaway info for list views
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayListResponse {

    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status; // ACTIVE, ENDED, CANCELLED
    private Long totalEntries; // Total number of entries for this giveaway
}