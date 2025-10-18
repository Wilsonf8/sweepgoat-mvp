package com.sweepgoat.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // EMAIL or SMS

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, SENT, DELIVERED, FAILED, OPENED, CLICKED

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "opened_at")
    private LocalDateTime openedAt; // For email tracking

    @Column(name = "clicked_at")
    private LocalDateTime clickedAt; // For link tracking

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage; // If failed, store the error

    @Column(name = "external_id")
    private String externalId; // ID from email/SMS provider (Twilio, SendGrid, etc.)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}