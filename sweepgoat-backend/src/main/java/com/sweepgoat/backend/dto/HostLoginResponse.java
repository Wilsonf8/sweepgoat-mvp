package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostLoginResponse {

    private String token;
    private String userType; // "HOST"
    private Long hostId;
    private String email;
    private String subdomain;
    private String companyName;
}