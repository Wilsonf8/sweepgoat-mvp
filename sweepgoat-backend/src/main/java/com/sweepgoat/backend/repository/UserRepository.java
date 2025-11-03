package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/*
 * Free methods from JpaRepository:
 *  - save(host) - Insert or update
 *  - findById(1L) - Find by primary key
 *  - findAll() - Get all records
 *  - deleteById(1L) - Delete by primary key
 *  - count() - Count all records
 *  - existsById(1L) - Check if exists
 *
 * Method Naming Convention:
 *  - findBy = SELECT
 *  - existsBy = Check if exists (returns boolean)
 *  - countBy = Count records
 *  - And = Multiple conditions with AND
 *  - Or = Multiple conditions with OR
 *  - After = Greater than (for dates/numbers)
 *  - Before = Less than
 *  - OrderBy = Sort results
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByHostId(Long hostId);

    List<User> findByHostId(Long hostId, Sort sort);

    Optional<User> findByEmailAndHostId(String email, Long hostId);

    boolean existsByEmailAndHostId(String email, Long hostId);

    @Query("SELECT DISTINCT u FROM User u " +
            "LEFT JOIN GiveawayEntry ge ON ge.user.id = u.id " +
            "WHERE u.host.id = :hostId " +
            "AND (:giveawayId IS NULL OR ge.giveaway.id = :giveawayId) " +
            "AND (:emailVerified IS NULL OR u.emailVerified = :emailVerified) " +
            "AND (:emailOptIn IS NULL OR u.emailOptIn = :emailOptIn) " +
            "AND (:smsOptIn IS NULL OR u.smsOptIn = :smsOptIn)")
    Page<User> findByHostIdWithFilters(
            @Param("hostId") Long hostId,
            @Param("giveawayId") Long giveawayId,
            @Param("emailVerified") Boolean emailVerified,
            @Param("emailOptIn") Boolean emailOptIn,
            @Param("smsOptIn") Boolean smsOptIn,
            Pageable pageable
    );
}