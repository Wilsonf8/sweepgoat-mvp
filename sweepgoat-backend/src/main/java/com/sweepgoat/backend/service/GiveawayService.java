package com.sweepgoat.backend.service;

import com.sweepgoat.backend.dto.CreateGiveawayRequest;
import com.sweepgoat.backend.dto.GiveawayDetailsResponse;
import com.sweepgoat.backend.dto.GiveawayListResponse;
import com.sweepgoat.backend.dto.GiveawayStatsResponse;
import com.sweepgoat.backend.dto.PaginatedResponse;
import com.sweepgoat.backend.exception.DuplicateResourceException;
import com.sweepgoat.backend.exception.ResourceNotFoundException;
import com.sweepgoat.backend.model.Giveaway;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.repository.GiveawayEntryRepository;
import com.sweepgoat.backend.repository.GiveawayRepository;
import com.sweepgoat.backend.repository.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GiveawayService {

    @Autowired
    private GiveawayRepository giveawayRepository;

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private GiveawayEntryRepository giveawayEntryRepository;

    /**
     * Get all active giveaways for a subdomain (PUBLIC - no auth required)
     * Status is kept accurate by the scheduled GiveawayStatusScheduler
     */
    public List<GiveawayListResponse> getAllActiveGiveawaysBySubdomain(String subdomain) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Get all active giveaways for this host
        // No need to filter by endDate - scheduler keeps status accurate
        List<Giveaway> giveaways = giveawayRepository.findByHostIdAndStatus(host.getId(), "ACTIVE");

        return giveaways.stream()
            .map(this::mapToListResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get single giveaway details (PUBLIC - no auth required)
     */
    public GiveawayDetailsResponse getGiveawayById(Long giveawayId, String subdomain) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Find giveaway
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        // Verify giveaway belongs to this subdomain
        if (!giveaway.getHost().getId().equals(host.getId())) {
            throw new ResourceNotFoundException("Giveaway not found on this subdomain");
        }

        return mapToDetailsResponse(giveaway);
    }

    /**
     * Get all giveaways for a host (HOST auth required)
     */
    public List<GiveawayListResponse> getGiveawaysByHostId(Long hostId) {
        List<Giveaway> giveaways = giveawayRepository.findByHostId(hostId);

        return giveaways.stream()
            .map(this::mapToListResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get single giveaway with details for host (HOST auth required)
     */
    public GiveawayDetailsResponse getHostGiveawayById(Long giveawayId, Long hostId) {
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        // Verify giveaway belongs to this host
        if (!giveaway.getHost().getId().equals(hostId)) {
            throw new ResourceNotFoundException("Giveaway not found");
        }

        return mapToDetailsResponse(giveaway);
    }

    /**
     * Get statistics for a giveaway (HOST auth required)
     */
    public GiveawayStatsResponse getGiveawayStats(Long giveawayId, Long hostId) {
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        // Verify giveaway belongs to this host
        if (!giveaway.getHost().getId().equals(hostId)) {
            throw new ResourceNotFoundException("Giveaway not found");
        }

        // Get entry statistics
        Long totalEntries = giveawayEntryRepository.countEntriesByGiveawayId(giveawayId);

        // Calculate total points (would need a custom query, for now just count * average)
        List<com.sweepgoat.backend.model.GiveawayEntry> entries =
            giveawayEntryRepository.findByGiveawayId(giveawayId);
        Long totalPoints = entries.stream()
            .mapToLong(e -> e.getPoints())
            .sum();

        return new GiveawayStatsResponse(
            giveaway.getId(),
            giveaway.getTitle(),
            totalEntries,
            totalPoints,
            totalEntries // With unique constraint, totalEntries = uniqueUsers
        );
    }

    /**
     * Map Giveaway entity to ListResponse DTO
     */
    private GiveawayListResponse mapToListResponse(Giveaway giveaway) {
        return new GiveawayListResponse(
            giveaway.getId(),
            giveaway.getTitle(),
            giveaway.getDescription(),
            giveaway.getImageUrl(),
            giveaway.getStartDate(),
            giveaway.getEndDate(),
            giveaway.getStatus()
        );
    }

    /**
     * Create a new giveaway (HOST auth required)
     * Only one active giveaway is allowed per host at a time
     */
    @Transactional
    public GiveawayDetailsResponse createGiveaway(CreateGiveawayRequest request, Long hostId) {
        // Find host
        Host host = hostRepository.findById(hostId)
            .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Check if host already has an active giveaway
        List<Giveaway> activeGiveaways = giveawayRepository.findByHostIdAndStatus(hostId, "ACTIVE");
        if (!activeGiveaways.isEmpty()) {
            throw new DuplicateResourceException("You already have an active giveaway. Only one active giveaway allowed at a time.");
        }

        // Create giveaway
        Giveaway giveaway = new Giveaway();
        giveaway.setHost(host);
        giveaway.setTitle(request.getTitle());
        giveaway.setDescription(request.getDescription());
        giveaway.setImageUrl(request.getImageUrl());
        giveaway.setStartDate(LocalDateTime.now()); // Auto-set start time to now
        giveaway.setEndDate(request.getEndDate());
        giveaway.setStatus("ACTIVE");

        giveaway = giveawayRepository.save(giveaway);

        return mapToDetailsResponse(giveaway);
    }

    /**
     * Get only active giveaways for a host (HOST auth required)
     */
    public List<GiveawayListResponse> getActiveGiveawaysByHostId(Long hostId) {
        List<Giveaway> giveaways = giveawayRepository.findByHostIdAndStatus(hostId, "ACTIVE");

        return giveaways.stream()
            .map(this::mapToListResponse)
            .collect(Collectors.toList());
    }

    /**
     * Delete a giveaway (HOST auth required)
     * This will also delete all associated entries
     */
    @Transactional
    public void deleteGiveaway(Long giveawayId, Long hostId) {
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        // Verify giveaway belongs to this host
        if (!giveaway.getHost().getId().equals(hostId)) {
            throw new ResourceNotFoundException("Giveaway not found");
        }

        // Delete all entries for this giveaway first (to avoid FK constraint violation)
        giveawayEntryRepository.deleteByGiveawayId(giveawayId);

        // Now delete the giveaway
        giveawayRepository.delete(giveaway);
    }

    /**
     * Get giveaways by subdomain with pagination and optional status filter (PUBLIC - no auth required)
     * Used for displaying giveaways on the tenant frontend with pagination
     */
    public PaginatedResponse<GiveawayListResponse> getGiveawaysBySubdomain(
        String subdomain,
        String status,  // "ENDED", "ACTIVE", "CANCELLED", or null for all
        Pageable pageable
    ) {
        // Find host by subdomain
        Host host = hostRepository.findBySubdomain(subdomain)
            .orElseThrow(() -> new ResourceNotFoundException("Subdomain not found: " + subdomain));

        // Get paginated giveaways - with or without status filter
        Page<Giveaway> giveawaysPage;
        if (status != null && !status.isEmpty()) {
            giveawaysPage = giveawayRepository.findByHostIdAndStatus(host.getId(), status, pageable);
        } else {
            giveawaysPage = giveawayRepository.findByHostId(host.getId(), pageable);
        }

        // Map to response DTOs
        List<GiveawayListResponse> data = giveawaysPage.getContent().stream()
            .map(this::mapToListResponse)
            .collect(Collectors.toList());

        // Build paginated response
        return new PaginatedResponse<>(
            data,
            giveawaysPage.getNumber(),
            giveawaysPage.getTotalPages(),
            giveawaysPage.getTotalElements(),
            giveawaysPage.getSize(),
            giveawaysPage.hasNext(),
            giveawaysPage.hasPrevious()
        );
    }

    /**
     * Map Giveaway entity to DetailsResponse DTO
     */
    private GiveawayDetailsResponse mapToDetailsResponse(Giveaway giveaway) {
        Long totalEntries = giveawayEntryRepository.countEntriesByGiveawayId(giveaway.getId());

        return new GiveawayDetailsResponse(
            giveaway.getId(),
            giveaway.getTitle(),
            giveaway.getDescription(),
            giveaway.getImageUrl(),
            giveaway.getStartDate(),
            giveaway.getEndDate(),
            giveaway.getStatus(),
            giveaway.getHost().getId(),
            giveaway.getHost().getSubdomain(),
            totalEntries,
            giveaway.getCreatedAt()
        );
    }
}