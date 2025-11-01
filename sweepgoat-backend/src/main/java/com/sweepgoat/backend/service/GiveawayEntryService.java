package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.GiveawayEntryLeaderboardResponse;
import com.sweepgoat.backend.dto.GiveawayEntryResponse;
import com.sweepgoat.backend.dto.PaginatedResponse;
import com.sweepgoat.backend.dto.UserEntryResponse;
import com.sweepgoat.backend.dto.UserGiveawayEntryResponse;
import com.sweepgoat.backend.exception.GiveawayEntryException;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Giveaway;
import com.sweepgoat.backend.model.GiveawayEntry;
import com.sweepgoat.backend.model.User;
import com.sweepgoat.backend.repository.GiveawayEntryRepository;
import com.sweepgoat.backend.repository.GiveawayRepository;
import com.sweepgoat.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
     * Claim one-time free entry (1 point)
     *
     * Business Rules:
     * - Always worth exactly 1 point
     * - Can only be claimed once per user per giveaway
     * - Sets freeEntryClaimed = true
     * - If user already has an entry for this giveaway, checks if free entry was already claimed
     */
    @Transactional
    public GiveawayEntryResponse claimFreeEntry(Long giveawayId, Long userId) {
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

            // User has an entry but hasn't claimed free entry yet (they used regular entries first)
            // Add 1 point and mark free entry as claimed
            existingEntry.setPoints(existingEntry.getPoints() + 1);
            existingEntry.setFreeEntryClaimed(true);
            existingEntry = giveawayEntryRepository.save(existingEntry);

            // Build response
            GiveawayEntryResponse.EntryDetails details = new GiveawayEntryResponse.EntryDetails(
                existingEntry.getId(),
                existingEntry.getPoints(),
                existingEntry.getFreeEntryClaimed(),
                giveaway.getId(),
                giveaway.getTitle(),
                existingEntry.getCreatedAt()
            );

            return new GiveawayEntryResponse(
                true,
                "Free entry claimed! Added 1 point to your existing entry.",
                details
            );
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
     * Add entries with variable points (paid entries)
     *
     * Business Rules:
     * - Variable points based on request (must be > 0)
     * - Can be used multiple times
     * - Does NOT affect freeEntryClaimed status
     * - Future: Will require payment/points purchase validation
     */
    @Transactional
    public GiveawayEntryResponse addRegularEntries(Long giveawayId, Long userId, Integer pointsToAdd) {
        // Validate points
        if (pointsToAdd == null || pointsToAdd <= 0) {
            throw new GiveawayEntryException("Points to add must be greater than 0");
        }

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
            // User already has an entry - add points to it
            existingEntry.setPoints(existingEntry.getPoints() + pointsToAdd);
            existingEntry = giveawayEntryRepository.save(existingEntry);

            // Build response
            GiveawayEntryResponse.EntryDetails details = new GiveawayEntryResponse.EntryDetails(
                existingEntry.getId(),
                existingEntry.getPoints(),
                existingEntry.getFreeEntryClaimed(),
                giveaway.getId(),
                giveaway.getTitle(),
                existingEntry.getCreatedAt()
            );

            return new GiveawayEntryResponse(
                true,
                "Added " + pointsToAdd + " points to your entry!",
                details
            );
        }

        // Create new entry with specified points
        GiveawayEntry entry = new GiveawayEntry();
        entry.setUser(user);
        entry.setGiveaway(giveaway);
        entry.setPoints(pointsToAdd);
        entry.setFreeEntryClaimed(false); // This is NOT a free entry

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
            "Successfully entered giveaway with " + pointsToAdd + " points!",
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
     * Get user's giveaway entry history with pagination
     * Returns all giveaways the user has entered (current and past)
     * Sorted by giveaway end date descending (most recent first)
     */
    public PaginatedResponse<UserGiveawayEntryResponse> getUserGiveawayEntries(Long userId, Pageable pageable) {
        // Verify user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get paginated entries sorted by giveaway end date desc
        Page<GiveawayEntry> entriesPage = giveawayEntryRepository
            .findByUserIdOrderByGiveawayEndDateDesc(userId, pageable);

        // Map to response DTOs
        List<UserGiveawayEntryResponse> data = entriesPage.getContent().stream()
            .map(this::mapToUserGiveawayEntryResponse)
            .collect(Collectors.toList());

        // Build paginated response
        return new PaginatedResponse<>(
            data,
            entriesPage.getNumber(),
            entriesPage.getTotalPages(),
            entriesPage.getTotalElements(),
            entriesPage.getSize(),
            entriesPage.hasNext(),
            entriesPage.hasPrevious()
        );
    }

    /**
     * Map GiveawayEntry to UserGiveawayEntryResponse
     * Determines status based on giveaway state and winner
     */
    private UserGiveawayEntryResponse mapToUserGiveawayEntryResponse(GiveawayEntry entry) {
        Giveaway giveaway = entry.getGiveaway();
        String status;
        Long winnerId = giveaway.getWinnerId();

        // Determine status
        if ("ACTIVE".equals(giveaway.getStatus())) {
            status = "ACTIVE";
        } else if ("ENDED".equals(giveaway.getStatus()) || "CANCELLED".equals(giveaway.getStatus())) {
            // Check if user won this giveaway
            if (winnerId != null && winnerId.equals(entry.getUser().getId())) {
                status = "WON";
            } else {
                status = "ENDED";
            }
        } else {
            status = "ENDED";
        }

        return new UserGiveawayEntryResponse(
            giveaway.getId(),
            giveaway.getTitle(),
            giveaway.getEndDate(),
            status,
            winnerId
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