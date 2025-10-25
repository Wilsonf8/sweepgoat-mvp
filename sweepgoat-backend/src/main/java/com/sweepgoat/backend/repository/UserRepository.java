package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
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

    Optional<User> findByUsernameAndHostId(String username, Long hostId);

    boolean existsByEmailAndHostId(String email, Long hostId);

    boolean existsByUsernameAndHostId(String username, Long hostId);
}