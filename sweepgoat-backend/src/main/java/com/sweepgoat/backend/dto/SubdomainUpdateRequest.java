package com.sweepgoat.backend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubdomainUpdateRequest {

    private String logoUrl; // Cloudflare Images URL

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Primary color must be a valid hex color code (e.g., #FF5733)")
    private String primaryColor; // Hex color code
}