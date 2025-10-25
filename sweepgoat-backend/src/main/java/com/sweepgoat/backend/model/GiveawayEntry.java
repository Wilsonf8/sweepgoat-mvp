package com.sweepgoat.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "giveaway_entries",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_user_giveaway",
        columnNames = {"user_id", "giveaway_id"}
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiveawayEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giveaway_id", nullable = false)
    private Giveaway giveaway;

    @Column(nullable = false)
    private Integer points = 0;

    @Column(name = "free_entry_claimed", nullable = false)
    private Boolean freeEntryClaimed = false; // Tracks if user has used their one-time free entry

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}