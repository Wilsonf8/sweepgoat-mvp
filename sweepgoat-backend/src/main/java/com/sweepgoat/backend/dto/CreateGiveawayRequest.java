package com.sweepgoat.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGiveawayRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String imageUrl; // Cloudflare Images URL

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
}