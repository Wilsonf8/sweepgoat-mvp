package com.sweepgoat.backend.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Cache configuration for subdomain validation
 * Uses Caffeine for high-performance in-memory caching
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String SUBDOMAIN_CACHE = "subdomains";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(SUBDOMAIN_CACHE);
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
            .maximumSize(1000)  // Max 1000 subdomains in cache
            .expireAfterWrite(10, TimeUnit.MINUTES)  // Cache expires after 10 minutes
            .recordStats();  // Enable cache statistics for monitoring
    }
}