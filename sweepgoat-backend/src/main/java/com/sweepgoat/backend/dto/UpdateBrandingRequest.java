package com.sweepgoat.backend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBrandingRequest {

    private String companyName; // Company name displayed on subdomain

    private String logoUrl; // Cloudflare Images URL

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
             message = "Primary color must be a valid hex color code (e.g., #FFFF00 or #FFF)")
    private String primaryColor; // Hex color code (supports #RGB or #RRGGBB format)
}