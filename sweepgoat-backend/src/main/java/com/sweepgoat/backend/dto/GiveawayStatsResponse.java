package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Statistics for a specific giveaway
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayStatsResponse {

    private Long giveawayId;
    private String title;
    private Long totalEntries; // Total number of users who entered
    private Long totalPoints; // Sum of all points across all entries
    private Long uniqueUsers; // Number of unique users (should equal totalEntries with current constraint)
}