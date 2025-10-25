package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayEntryResponse {

    private Boolean success;
    private String message;
    private EntryDetails entry;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EntryDetails {
        private Long entryId;
        private Integer points;
        private Boolean freeEntryClaimed; // Whether user has claimed their one-time free entry
        private Long giveawayId;
        private String giveawayTitle;
        private LocalDateTime enteredAt;
    }
}