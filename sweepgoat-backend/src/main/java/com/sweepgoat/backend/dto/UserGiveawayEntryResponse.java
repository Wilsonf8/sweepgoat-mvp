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
    private String title;
    private LocalDateTime endDate;
    private String status; // "ACTIVE", "WON", "ENDED"
    private Long winnerId; // null if no winner selected yet
}