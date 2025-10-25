# User Filtering Plan for GET /api/host/users

**Date**: 2025-10-24
**Status**: Planned (Not Yet Implemented)

## Current State
- **Endpoint**: `GET /api/host/users?sortBy={field}&sortOrder={asc|desc}`
- **Current Features**: Sorting only
- **Current Implementation**: Uses simple repository method `userRepository.findByHostId(hostId, sort)`

## Objective
Add filtering capabilities to the user list endpoint so hosts can filter their users by:
1. **giveawayId** - Users entered in a specific giveaway (requires JOIN with giveaway_entries table)
2. **emailVerified** - Boolean filter (true/false/null=all)
3. **emailOptIn** - Boolean filter
4. **smsOptIn** - Boolean filter

## Updated Endpoint Signature

```
GET /api/host/users?sortBy={field}&sortOrder={asc|desc}&giveawayId={id}&emailVerified={bool}&emailOptIn={bool}&smsOptIn={bool}
```

**All filters are optional.** If not provided, return all users for the host.

## Implementation Approach

### Use Custom JPQL Query with LEFT JOIN

Since `giveawayId` requires joining with the `giveaway_entries` table, we need a custom JPQL query in the repository.

**Key Design Decisions:**
- **LEFT JOIN**: So users without any giveaway entries still appear when no giveawayId filter is applied
- **DISTINCT**: Prevents duplicate users in results (safe practice with JOINs)
- **NULL checks**: Each filter parameter can be null, meaning "don't filter by this"

## Code Changes Required

### 1. UserRepository.java

Add new method with custom JPQL query:

```java
package com.sweepgoat.backend.repository;

import com.sweepgoat.backend.model.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ... existing methods ...

    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN GiveawayEntry ge ON ge.user.id = u.id " +
           "WHERE u.host.id = :hostId " +
           "AND (:giveawayId IS NULL OR ge.giveaway.id = :giveawayId) " +
           "AND (:emailVerified IS NULL OR u.emailVerified = :emailVerified) " +
           "AND (:emailOptIn IS NULL OR u.emailOptIn = :emailOptIn) " +
           "AND (:smsOptIn IS NULL OR u.smsOptIn = :smsOptIn)")
    List<User> findByHostIdWithFilters(
        @Param("hostId") Long hostId,
        @Param("giveawayId") Long giveawayId,
        @Param("emailVerified") Boolean emailVerified,
        @Param("emailOptIn") Boolean emailOptIn,
        @Param("smsOptIn") Boolean smsOptIn,
        Sort sort
    );
}
```

**JPQL Explanation:**
- `SELECT DISTINCT u` - Get unique users
- `LEFT JOIN GiveawayEntry ge ON ge.user.id = u.id` - Join with giveaway entries
- `:giveawayId IS NULL OR ge.giveaway.id = :giveawayId` - If giveawayId param is null, don't filter; otherwise filter by it
- Same pattern for other filters - null means "ignore this filter"

### 2. HostUserController.java

Add new query parameters:

```java
package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.UserListResponse;
import com.sweepgoat.backend.service.UserAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class HostUserController {

    @Autowired
    private UserAuthService userAuthService;

    /**
     * GET /api/host/users
     * Get all users registered on the authenticated host's subdomain
     *
     * Query parameters:
     * - sortBy: field to sort by (lastLoginAt, createdAt, email, firstName, lastName)
     * - sortOrder: asc or desc (default: desc)
     * - giveawayId: filter users who entered this giveaway
     * - emailVerified: filter by email verification status (true/false)
     * - emailOptIn: filter by email opt-in status (true/false)
     * - smsOptIn: filter by SMS opt-in status (true/false)
     *
     * Examples:
     * - /api/host/users
     * - /api/host/users?giveawayId=5
     * - /api/host/users?emailVerified=true&emailOptIn=true
     * - /api/host/users?giveawayId=3&smsOptIn=true&sortBy=lastName
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserListResponse>> getAllUsers(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) Long giveawayId,
            @RequestParam(required = false) Boolean emailVerified,
            @RequestParam(required = false) Boolean emailOptIn,
            @RequestParam(required = false) Boolean smsOptIn,
            HttpServletRequest request) {

        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        List<UserListResponse> users = userAuthService.getUsersByHostId(
            hostId, sortBy, sortOrder, giveawayId, emailVerified, emailOptIn, smsOptIn
        );

        return ResponseEntity.ok(users);
    }
}
```

### 3. UserAuthService.java

Update `getUsersByHostId()` method:

```java
/**
 * Get all users for a host with optional filtering and sorting
 * Supports filtering by giveaway, email verification, and opt-in status
 */
public List<UserListResponse> getUsersByHostId(
        Long hostId,
        String sortBy,
        String sortOrder,
        Long giveawayId,
        Boolean emailVerified,
        Boolean emailOptIn,
        Boolean smsOptIn) {

    // VALIDATION: If giveawayId provided, verify it belongs to this host
    if (giveawayId != null) {
        Giveaway giveaway = giveawayRepository.findById(giveawayId)
            .orElseThrow(() -> new ResourceNotFoundException("Giveaway not found"));

        if (!giveaway.getHost().getId().equals(hostId)) {
            throw new ResourceNotFoundException("Giveaway not found");
        }
    }

    // Determine sort direction
    org.springframework.data.domain.Sort.Direction direction =
        "asc".equalsIgnoreCase(sortOrder) ?
        org.springframework.data.domain.Sort.Direction.ASC :
        org.springframework.data.domain.Sort.Direction.DESC;

    // Determine sort field (with validation)
    String sortField;
    if (sortBy != null && !sortBy.isEmpty()) {
        switch (sortBy.toLowerCase()) {
            case "lastloginat":
                sortField = "lastLoginAt";
                break;
            case "createdat":
                sortField = "createdAt";
                break;
            case "email":
                sortField = "email";
                break;
            case "firstname":
                sortField = "firstName";
                break;
            case "lastname":
                sortField = "lastName";
                break;
            default:
                logger.warn("Invalid sortBy field '{}', defaulting to createdAt", sortBy);
                sortField = "createdAt";
        }
    } else {
        sortField = "createdAt";
    }

    // Create sort object
    org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(direction, sortField);

    // Fetch filtered and sorted users
    List<User> users = userRepository.findByHostIdWithFilters(
        hostId, giveawayId, emailVerified, emailOptIn, smsOptIn, sort
    );

    // Map to DTOs
    return users.stream()
        .map(user -> new UserListResponse(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhoneNumber(),
            user.getEmailVerified(),
            user.getIsActive(),
            user.getCreatedAt(),
            user.getLastLoginAt()
        ))
        .collect(java.util.stream.Collectors.toList());
}
```

**Important**: Add `GiveawayRepository` autowired dependency to `UserAuthService`:

```java
@Autowired
private GiveawayRepository giveawayRepository;
```

## Example API Usage

### All users on host's subdomain
```
GET /api/host/users
```

### Users who entered giveaway ID 5
```
GET /api/host/users?giveawayId=5
```

### Verified users who opted into email marketing
```
GET /api/host/users?emailVerified=true&emailOptIn=true
```

### Users in giveaway 3 who opted into SMS, sorted by last login
```
GET /api/host/users?giveawayId=3&smsOptIn=true&sortBy=lastLoginAt&sortOrder=desc
```

### Unverified users (for re-sending verification emails)
```
GET /api/host/users?emailVerified=false
```

### Users who opted into both email and SMS
```
GET /api/host/users?emailOptIn=true&smsOptIn=true
```

## Files to Modify

1. ✅ `src/main/java/com/sweepgoat/backend/repository/UserRepository.java`
   - Add `findByHostIdWithFilters()` method with JPQL query

2. ✅ `src/main/java/com/sweepgoat/backend/controller/HostUserController.java`
   - Add 4 new `@RequestParam` parameters
   - Update JavaDoc comments

3. ✅ `src/main/java/com/sweepgoat/backend/service/UserAuthService.java`
   - Update `getUsersByHostId()` method signature
   - Add giveaway validation logic
   - Add `@Autowired GiveawayRepository giveawayRepository`

4. ✅ `CLAUDE.md`
   - Document new filter parameters in API Endpoints section

5. ✅ `RootController.java`
   - Update notes about user filtering capabilities

## Testing Plan

### Postman Tests to Add

Create new section: "TEST - User Filtering"

1. **Filter by Giveaway**
   - Request: `GET /api/host/users?giveawayId={{giveaway1Id}}`
   - Verify: Only users who entered giveaway 1 are returned
   - Verify: Alice and Bob should be in results (they entered giveaway 1)

2. **Filter by Email Verified**
   - Request: `GET /api/host/users?emailVerified=true`
   - Verify: All returned users have `emailVerified: true`

3. **Filter by Email Opt-In**
   - Request: `GET /api/host/users?emailOptIn=true`
   - Verify: All returned users have `emailOptIn: true`

4. **Filter by SMS Opt-In**
   - Request: `GET /api/host/users?smsOptIn=true`
   - Verify: All returned users have `smsOptIn: true`

5. **Combined Filters**
   - Request: `GET /api/host/users?giveawayId={{giveaway1Id}}&emailOptIn=true`
   - Verify: Only users in giveaway 1 who opted into email

6. **Invalid Giveaway ID**
   - Request: `GET /api/host/users?giveawayId=99999`
   - Verify: Returns 404 Not Found

7. **Cross-Tenant Giveaway (Security Test)**
   - Request: Host 1 tries to filter by Host 2's giveaway
   - Verify: Returns 404 Not Found (not authorized)

8. **Filter + Sorting**
   - Request: `GET /api/host/users?emailOptIn=true&sortBy=firstName&sortOrder=asc`
   - Verify: Users with emailOptIn=true, sorted alphabetically by first name

## Backward Compatibility

✅ **Fully backward compatible**
- All new parameters are optional
- Existing API calls without filters work exactly as before
- Default behavior unchanged

## Security Considerations

1. **Multi-tenant Isolation**: Validate that giveawayId belongs to the authenticated host
2. **Authorization**: Only hosts can access this endpoint (enforced by `@hasRole("HOST")`)
3. **Input Validation**: Boolean params auto-convert; invalid giveawayId returns 404

## Performance Considerations

- **LEFT JOIN**: Efficient with proper indexes on `giveaway_entries.user_id` and `giveaway_entries.giveaway_id`
- **DISTINCT**: May have small performance cost, but necessary for correct results
- **Recommendation**: Add database indexes if not already present:
  ```sql
  CREATE INDEX idx_giveaway_entries_user_id ON giveaway_entries(user_id);
  CREATE INDEX idx_giveaway_entries_giveaway_id ON giveaway_entries(giveaway_id);
  ```

## Future Enhancements

- Add date range filters (e.g., `createdAfter`, `createdBefore`, `lastLoginAfter`, `lastLoginBefore`)
- Add text search (e.g., `search=alice` to search by name or email)
- Add pagination support (e.g., `page=1&size=20`)
- Add filter by `isActive` status

## Estimated Implementation Time

**1-2 hours** including:
- Code changes (30-45 min)
- Testing (30-45 min)
- Documentation updates (15-30 min)

---

**Reference**: This plan was created on 2025-10-24 for the Sweepgoat multi-tenant giveaway platform.