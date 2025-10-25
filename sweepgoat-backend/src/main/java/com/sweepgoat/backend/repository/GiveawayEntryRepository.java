package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.GiveawayEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GiveawayEntryRepository extends JpaRepository<GiveawayEntry, Long> {

    Optional<GiveawayEntry> findByUserIdAndGiveawayId(Long userId, Long giveawayId);

    List<GiveawayEntry> findByGiveawayId(Long giveawayId);

    List<GiveawayEntry> findByUserId(Long userId);

    boolean existsByUserIdAndGiveawayId(Long userId, Long giveawayId);

    void deleteByGiveawayId(Long giveawayId);

    @Query("SELECT ge FROM GiveawayEntry ge WHERE ge.giveaway.id = :giveawayId ORDER BY ge.points DESC")
    List<GiveawayEntry> findByGiveawayIdOrderByPointsDesc(@Param("giveawayId") Long giveawayId);

    @Query("SELECT COUNT(ge) FROM GiveawayEntry ge WHERE ge.giveaway.id = :giveawayId")
    Long countEntriesByGiveawayId(@Param("giveawayId") Long giveawayId);
}