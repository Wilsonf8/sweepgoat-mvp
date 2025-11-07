package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignRecipientResponse {

    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String status; // PENDING, SENT, DELIVERED, FAILED, OPENED, CLICKED
    private LocalDateTime sentAt;
    private String errorMessage;
}