package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.Giveaway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GiveawayRepository extends JpaRepository<Giveaway, Long> {

    List<Giveaway> findByHostId(Long hostId);

    Optional<Giveaway> findByIdAndHostId(Long id, Long hostId);

    List<Giveaway> findByHostIdAndStatus(Long hostId, String status);

    List<Giveaway> findByHostIdAndEndDateAfter(Long hostId, LocalDateTime date);

    List<Giveaway> findByHostIdAndStartDateBeforeAndEndDateAfter(
        Long hostId,
        LocalDateTime endCheck,
        LocalDateTime startCheck
    );
}