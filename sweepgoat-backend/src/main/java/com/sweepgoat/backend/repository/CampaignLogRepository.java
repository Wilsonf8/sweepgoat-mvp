package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.CampaignLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignLogRepository extends JpaRepository<CampaignLog, Long> {

    List<CampaignLog> findByCampaignId(Long campaignId);

    List<CampaignLog> findByUserId(Long userId);

    List<CampaignLog> findByCampaignIdAndStatus(Long campaignId, String status);

    Optional<CampaignLog> findByCampaignIdAndUserId(Long campaignId, Long userId);

    // Count logs by status for a campaign
    Long countByCampaignIdAndStatus(Long campaignId, String status);

    // Get delivery stats for a campaign
    @Query("SELECT cl.status, COUNT(cl) FROM CampaignLog cl WHERE cl.campaign.id = :campaignId GROUP BY cl.status")
    List<Object[]> getCampaignStats(@Param("campaignId") Long campaignId);

    // Check if user received a campaign
    boolean existsByCampaignIdAndUserId(Long campaignId, Long userId);
}