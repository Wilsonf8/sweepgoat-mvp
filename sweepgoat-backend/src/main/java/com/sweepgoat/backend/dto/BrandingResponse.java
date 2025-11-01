package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandingResponse {
    private String logoUrl;
    private String primaryColor;
}