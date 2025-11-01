package com.sweepgoat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private Host host;

    @NotBlank(message = "Campaign name is required")
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // EMAIL, SMS, BOTH

    @Column(columnDefinition = "TEXT")
    private String subject; // For email campaigns

    @NotBlank(message = "Message content is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt; // When to send (null = send immediately)

    @Column(nullable = false)
    private String status = "DRAFT"; // DRAFT, SCHEDULED, SENDING, SENT, CANCELLED

    @Column(name = "target_type", nullable = false)
    private String targetType = "ALL_USERS"; // ALL_USERS, GIVEAWAY_PARTICIPANTS, SPECIFIC_GIVEAWAY

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giveaway_id", nullable = true)
    private Giveaway giveaway; // If targeting specific giveaway participants

    @Column(name = "sent_at")
    private LocalDateTime sentAt; // When campaign was actually sent

    @Column(name = "total_recipients")
    private Integer totalRecipients = 0; // Total users targeted

    @Column(name = "total_sent")
    private Integer totalSent = 0; // Successfully sent

    @Column(name = "total_failed")
    private Integer totalFailed = 0; // Failed to send

    @Column(name = "filters_json", columnDefinition = "TEXT")
    private String filtersJson; // JSON string storing filter criteria used for targeting

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}