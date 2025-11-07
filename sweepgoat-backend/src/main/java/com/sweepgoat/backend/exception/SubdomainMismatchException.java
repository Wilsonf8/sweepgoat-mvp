package com.sweepgoat.backend.exception;

/**
 * Exception thrown when a host attempts to log in from a subdomain
 * that doesn't match their registered subdomain.
 *
 * Security: Hosts should only be able to log in from:
 * 1. Their own subdomain (e.g., acme host at acme.sweepgoat.com)
 * 2. The main domain (sweepgoat.com) - for flexibility
 */
public class SubdomainMismatchException extends RuntimeException {

    private final String attemptedSubdomain;
    private final String actualSubdomain;

    public SubdomainMismatchException(String message, String attemptedSubdomain, String actualSubdomain) {
        super(message);
        this.attemptedSubdomain = attemptedSubdomain;
        this.actualSubdomain = actualSubdomain;
    }

    public String getAttemptedSubdomain() {
        return attemptedSubdomain;
    }

    public String getActualSubdomain() {
        return actualSubdomain;
    }
}