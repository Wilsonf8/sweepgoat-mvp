package com.sweepgoat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic wrapper for paginated API responses
 * Reusable for any entity type (Users, Giveaways, Entries, etc.)
 *
 * Example usage:
 *   PaginatedResponse<UserListResponse> users = ...
 *   PaginatedResponse<GiveawayListResponse> giveaways = ...
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<T> {

    /**
     * The actual data for the current page
     */
    private List<T> data;

    /**
     * Current page number (0-indexed)
     * Example: 0 = first page, 1 = second page
     */
    private int currentPage;

    /**
     * Total number of pages available
     * Example: If totalItems=237 and pageSize=50, then totalPages=5
     */
    private int totalPages;

    /**
     * Total number of items across all pages
     * Example: 237 users in the database
     */
    private long totalItems;

    /**
     * Number of items per page
     * Example: 50 (default page size)
     */
    private int pageSize;

    /**
     * Whether there is a next page available
     * Useful for "Load More" or "Next" buttons
     */
    private boolean hasNext;

    /**
     * Whether there is a previous page available
     * Useful for "Previous" buttons
     */
    private boolean hasPrevious;
}