package com.sweepgoat.backend.service;

import com.sweepgoat.backend.model.Giveaway;
import com.sweepgoat.backend.repository.GiveawayRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled service that automatically updates giveaway statuses
 * Runs every 5 minutes to check for expired giveaways
 */
@Service
public class GiveawayStatusScheduler {

    private static final Logger logger = LoggerFactory.getLogger(GiveawayStatusScheduler.class);

    @Autowired
    private GiveawayRepository giveawayRepository;

    /**
     * Automatically update expired giveaways from ACTIVE to ENDED
     * Runs every 5 minutes (300,000 milliseconds)
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void updateExpiredGiveaways() {
        LocalDateTime now = LocalDateTime.now();

        // Find all active giveaways that have passed their end date
        List<Giveaway> activeGiveaways = giveawayRepository.findByStatus("ACTIVE");

        int updatedCount = 0;
        for (Giveaway giveaway : activeGiveaways) {
            // Check if giveaway has ended
            if (giveaway.getEndDate().isBefore(now)) {
                giveaway.setStatus("ENDED");
                giveawayRepository.save(giveaway);
                updatedCount++;

                logger.info("Giveaway {} (ID: {}) automatically ended at {}",
                    giveaway.getTitle(), giveaway.getId(), now);
            }
        }

        if (updatedCount > 0) {
            logger.info("Updated {} expired giveaway(s) to ENDED status", updatedCount);
        }
    }
}