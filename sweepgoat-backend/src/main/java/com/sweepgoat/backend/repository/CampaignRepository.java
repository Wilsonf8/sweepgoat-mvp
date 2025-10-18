package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByHostId(Long hostId);

    Optional<Campaign> findByIdAndHostId(Long id, Long hostId);

    List<Campaign> findByHostIdAndStatus(Long hostId, String status);

    List<Campaign> findByHostIdAndType(Long hostId, String type);

    // Find campaigns scheduled to be sent
    @Query("SELECT c FROM Campaign c WHERE c.status = 'SCHEDULED' AND c.scheduledAt <= :now")
    List<Campaign> findScheduledCampaignsReadyToSend(@Param("now") LocalDateTime now);

    // Find campaigns by giveaway
    List<Campaign> findByGiveawayId(Long giveawayId);

    // Count campaigns by host
    Long countByHostId(Long hostId);
}