package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponse {

    private String token;
    private String userType; // "USER"
    private Long userId;
    private String email;
    private String username;
    private Long hostId;
    private String subdomain;
}