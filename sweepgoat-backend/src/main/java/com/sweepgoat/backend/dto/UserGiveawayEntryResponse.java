package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserGiveawayEntryResponse {
    private Long giveawayId;
    private String giveawayTitle;  // Changed from 'title' to match frontend expectation
    private String giveawayImageUrl; // Added for frontend
    private LocalDateTime giveawayEndDate;  // Changed from 'endDate' to match frontend expectation
    private Integer points;  // Added - user's entry points
    private String status; // "ACTIVE", "WON", "ENDED"
    private Boolean freeEntryClaimed;  // Added for completeness
}