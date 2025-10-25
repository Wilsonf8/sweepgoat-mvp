package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User's entry with giveaway information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntryResponse {

    private Long entryId;
    private Integer points;
    private Boolean freeEntryClaimed;
    private LocalDateTime enteredAt;

    // Giveaway info
    private Long giveawayId;
    private String giveawayTitle;
    private String giveawayImageUrl;
    private LocalDateTime giveawayEndDate;
    private String giveawayStatus;
}