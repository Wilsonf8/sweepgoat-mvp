package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.GiveawayEntryLeaderboardResponse;
import com.sweepgoat.backend.dto.GiveawayEntryResponse;
import com.sweepgoat.backend.dto.UserEntryResponse;
import com.sweepgoat.backend.exception.GiveawayEntryException;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Giveaway;
import com.sweepgoat.backend.model.GiveawayEntry;
import com.sweepgoat.backend.model.User;
import com.sweepgoat.backend.repository.GiveawayEntryRepository;
import com.sweepgoat.backend.repository.GiveawayRepository;
import com.sweepgoat.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GiveawayEntryService {

    @Autowired
    private GiveawayEntryRepository giveawayEntryRepository;

    @Autowired
    private GiveawayRepository giveawayRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Enter user into giveaway for free (1 point)
     * This is the MVP "Enter for Free" button functionality
     */
    @Transactional
    public GiveawayEntryResponse enterGiveawayForFree(Long giveawayId, Long userId) {
        // Find user first
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get hostId from user
        Long hostId = user.getHost().getId();

        // Find giveaway
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        // Verify giveaway belongs to the same host as the user
        if (!giveaway.getHost().getId().equals(hostId)) {
            throw new GiveawayEntryException("This giveaway does not belong to your subdomain");
        }

        // Verify giveaway is active
        if (!"ACTIVE".equals(giveaway.getStatus())) {
            throw new GiveawayEntryException("This giveaway is not active");
        }

        // Verify giveaway hasn't ended
        if (giveaway.getEndDate().isBefore(LocalDateTime.now())) {
            throw new GiveawayEntryException("This giveaway has ended");
        }

        // Check if user has already entered this giveaway
        GiveawayEntry existingEntry = giveawayEntryRepository
            .findByUserIdAndGiveawayId(userId, giveawayId)
            .orElse(null);

        if (existingEntry != null) {
            // User already has an entry - check if they've already claimed their free entry
            if (existingEntry.getFreeEntryClaimed()) {
                throw new GiveawayEntryException("You have already claimed your free entry for this giveaway");
            }
            // Future: This is where paid entry logic would go
            throw new GiveawayEntryException("You have already entered this giveaway");
        }

        // Create new entry with 1 point and mark free entry as claimed
        GiveawayEntry entry = new GiveawayEntry();
        entry.setUser(user);
        entry.setGiveaway(giveaway);
        entry.setPoints(1); // Free entry gives 1 point
        entry.setFreeEntryClaimed(true); // Mark that user has claimed their one-time free entry

        entry = giveawayEntryRepository.save(entry);

        // Build response
        GiveawayEntryResponse.EntryDetails details = new GiveawayEntryResponse.EntryDetails(
            entry.getId(),
            entry.getPoints(),
            entry.getFreeEntryClaimed(),
            giveaway.getId(),
            giveaway.getTitle(),
            entry.getCreatedAt()
        );

        return new GiveawayEntryResponse(
            true,
            "Successfully entered giveaway!",
            details
        );
    }

    /**
     * Get all entries for a user (USER auth required)
     */
    public List<UserEntryResponse> getUserEntries(Long userId) {
        // Verify user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get all entries for this user
        List<GiveawayEntry> entries = giveawayEntryRepository.findByUserId(userId);

        return entries.stream()
            .map(this::mapToUserEntryResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get all entries for a giveaway (HOST auth required)
     * Returns leaderboard sorted by points descending
     */
    public List<GiveawayEntryLeaderboardResponse> getEntriesForGiveaway(Long giveawayId, Long hostId) {
        // Find giveaway
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        // Verify giveaway belongs to this host
        if (!giveaway.getHost().getId().equals(hostId)) {
            throw new ResourceNotFoundException("Giveaway not found");
        }

        // Get all entries sorted by points descending
        List<GiveawayEntry> entries = giveawayEntryRepository.findByGiveawayIdOrderByPointsDesc(giveawayId);

        return entries.stream()
            .map(this::mapToLeaderboardResponse)
            .collect(Collectors.toList());
    }

    /**
     * Map GiveawayEntry to UserEntryResponse
     */
    private UserEntryResponse mapToUserEntryResponse(GiveawayEntry entry) {
        Giveaway giveaway = entry.getGiveaway();

        return new UserEntryResponse(
            entry.getId(),
            entry.getPoints(),
            entry.getFreeEntryClaimed(),
            entry.getCreatedAt(),
            giveaway.getId(),
            giveaway.getTitle(),
            giveaway.getImageUrl(),
            giveaway.getEndDate(),
            giveaway.getStatus()
        );
    }

    /**
     * Map GiveawayEntry to LeaderboardResponse
     */
    private GiveawayEntryLeaderboardResponse mapToLeaderboardResponse(GiveawayEntry entry) {
        User user = entry.getUser();

        return new GiveawayEntryLeaderboardResponse(
            entry.getId(),
            entry.getPoints(),
            entry.getFreeEntryClaimed(),
            entry.getCreatedAt(),
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName()
        );
    }
}