package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, Long> {

    Optional<Host> findBySubdomain(String subdomain);

    boolean existsBySubdomain(String subdomain);

    Optional<Host> findByEmail(String email);
}