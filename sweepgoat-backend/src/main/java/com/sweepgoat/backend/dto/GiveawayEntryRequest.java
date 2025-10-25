package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayEntryRequest {
    private Integer points;        // For future paid entry support
    private Boolean isFreeEntry;   // True for free entry (MVP)
}