package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for winner selection containing winner details and giveaway info
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WinnerSelectionResponse {

    private Long giveawayId;
    private String giveawayTitle;
    private Long winnerId;
    private String winnerEmail;
    private String winnerFirstName;
    private String winnerLastName;
    private String winnerPhoneNumber;
    private Integer winnerPoints;
    private LocalDateTime selectedAt;
    private Integer totalEntries; // Total number of entries in the giveaway
}