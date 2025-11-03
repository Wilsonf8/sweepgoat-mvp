package com.sweepgoat.backend.service;

import com.sweepgoat.backend.config.CacheConfig;
import com.sweepgoat.backend.model.Host;
import com.sweepgoat.backend.repository.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Service for subdomain validation with caching
 */
@Service
public class SubdomainValidationService {

    @Autowired
    private HostRepository hostRepository;

    /**
     * Validate subdomain - returns host if subdomain exists and email is verified
     * Results are cached for 10 minutes to improve performance
     *
     * @param subdomain The subdomain to validate
     * @return Host if valid, null otherwise
     */
    @Cacheable(value = CacheConfig.SUBDOMAIN_CACHE, key = "#subdomain", unless = "#result == null")
    public Host validateSubdomain(String subdomain) {
        if (subdomain == null || subdomain.isEmpty()) {
            return null;
        }

        Host host = hostRepository.findBySubdomain(subdomain).orElse(null);

        // Only cache and return valid hosts (exists AND email verified)
        if (host != null && host.getEmailVerified()) {
            return host;
        }

        return null;
    }

    /**
     * Invalidate cache for a subdomain
     * Call this when host verifies email or updates subdomain
     *
     * @param subdomain The subdomain to invalidate
     */
    @CacheEvict(value = CacheConfig.SUBDOMAIN_CACHE, key = "#subdomain")
    public void invalidateSubdomainCache(String subdomain) {
        // Cache eviction handled by annotation
    }

    /**
     * Clear all cached subdomains
     * Useful for testing or manual cache flush
     */
    @CacheEvict(value = CacheConfig.SUBDOMAIN_CACHE, allEntries = true)
    public void clearAllCache() {
        // Cache eviction handled by annotation
    }
}