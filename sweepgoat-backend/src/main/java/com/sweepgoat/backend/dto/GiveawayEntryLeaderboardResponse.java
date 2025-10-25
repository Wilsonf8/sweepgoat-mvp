package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entry with user information for host leaderboard view
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayEntryLeaderboardResponse {

    private Long entryId;
    private Integer points;
    private Boolean freeEntryClaimed;
    private LocalDateTime enteredAt;

    // User info
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}