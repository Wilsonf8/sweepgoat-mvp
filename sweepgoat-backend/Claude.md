# Sweepgoat Backend - Claude Documentation

**Last Updated**: 2025-10-23
**Version**: 1.0.0 MVP
**Stack**: Spring Boot 3.5.6, Java 21, PostgreSQL 16.10

## Project Overview

Sweepgoat is a multi-tenant giveaway platform where businesses (hosts) can create and manage giveaways for their users. The platform uses subdomain-based tenant isolation.

### Architecture Pattern
- **Multi-tenant**: One host per subdomain (e.g., `acme.sweepgoat.com`)
- **Authentication**: Stateless JWT with role-based access (HOST vs USER)
- **Database**: PostgreSQL with JPA/Hibernate
- **Auto-reload**: Spring Boot DevTools configured on port 35729

## Key Entities

### Host
- Represents a business/organization
- Each host gets a unique subdomain
- Can create multiple giveaways
- Has many users registered on their subdomain
- **File**: `src/main/java/com/sweepgoat/backend/model/Host.java`

### User
- Belongs to one host (one subdomain)
- Same email can exist across different subdomains
- Must verify email before login (6-digit code, 24hr expiry)
- Tracks last login timestamp (`lastLoginAt`)
- **File**: `src/main/java/com/sweepgoat/backend/model/User.java`

### Giveaway
- Created by hosts
- Has status: ACTIVE, ENDED, CANCELLED
- Contains: title, description, imageUrl, startDate, endDate
- **File**: `src/main/java/com/sweepgoat/backend/model/Giveaway.java`

### GiveawayEntry
- One row per user+giveaway (unique constraint)
- Accumulates points for the same user/giveaway
- Tracks if user has claimed free entry (`freeEntryClaimed`)
- **File**: `src/main/java/com/sweepgoat/backend/model/GiveawayEntry.java`

## API Endpoints (24 total)

### Authentication Endpoints (No auth required)
```
POST /api/auth/host/register      # Register new host (main domain only)
POST /api/auth/host/login          # Host login
POST /api/auth/user/register       # Register user (subdomain only)
POST /api/auth/user/login          # User login (subdomain only)
POST /api/auth/user/verify-email   # Verify email with 6-digit code
POST /api/auth/user/resend-verification  # Resend verification code
```

### Public Endpoints (No auth required)
```
GET /api/public/giveaways          # List active giveaways for subdomain
GET /api/public/giveaways/{id}     # Get giveaway details
```

### User Endpoints (USER auth required)
```
GET /api/user/my-entries           # View user's giveaway entries
POST /api/user/giveaways/{id}/enter  # Enter a giveaway
DELETE /api/user/account           # Delete user account
```

### Host Endpoints (HOST auth required)
```
GET /api/host/giveaways            # List all giveaways
GET /api/host/giveaways/active     # List only active giveaways
GET /api/host/giveaways/{id}       # Get giveaway details
GET /api/host/giveaways/{id}/stats # Get giveaway statistics
GET /api/host/giveaways/{id}/entries  # View leaderboard
POST /api/host/giveaways           # Create new giveaway
DELETE /api/host/giveaways/{id}    # Delete giveaway
GET /api/host/users                # View all registered users
DELETE /api/host/account           # Delete host account
```

### Utility Endpoints
```
GET /                              # API info and endpoint list
GET /health                        # Health check
```

## Important Implementation Details

### Subdomain Routing
- Header: `X-Subdomain` is used to identify tenant
- Extracted via `SubdomainExtractor` utility
- **File**: `src/main/java/com/sweepgoat/backend/util/SubdomainExtractor.java`

### JWT Authentication
- Filter: `JwtAuthenticationFilter` processes JWT tokens
- Sets `userId` or `hostId` as request attributes
- **Files**:
  - `src/main/java/com/sweepgoat/backend/security/JwtAuthenticationFilter.java`
  - `src/main/java/com/sweepgoat/backend/util/JwtUtil.java`

### Email Verification Flow
1. User registers → receives 6-digit code via email
2. Code expires after 24 hours
3. Login blocked until email verified
4. Exception: `EmailNotVerifiedException` returns special response
5. **File**: `src/main/java/com/sweepgoat/backend/service/UserAuthService.java`

### Last Login Tracking
- Automatically updated on successful user login
- Stored in `User.lastLoginAt` field
- Visible to hosts via `GET /api/host/users` endpoint

### Giveaway Entry Logic
- One entry row per user+giveaway (enforced by unique constraint)
- Points accumulate on the same row for multiple entries
- `freeEntryClaimed` tracks if user used their one-time free entry
- **File**: `src/main/java/com/sweepgoat/backend/service/GiveawayEntryService.java`

## Security Configuration

### Spring Security Setup
```java
- permitAll(): /api/auth/**, /api/public/**, /, /health
- hasRole("HOST"): /api/host/**
- hasRole("USER"): /api/user/**
```
**File**: `src/main/java/com/sweepgoat/backend/config/SecurityConfig.java`

### Password Hashing
- BCrypt via `PasswordEncoder`
- Configured in `SecurityConfig`

## Database Configuration

### Connection Details
```
Database: PostgreSQL 16.10
Port: 5433
Schema: Managed by Hibernate (auto-update)
```
**File**: `src/main/resources/application-dev.properties`

### Repository Pattern
All repositories extend `JpaRepository<T, Long>`
- **UserRepository**: Custom queries for email+hostId lookups
- **HostRepository**: Subdomain lookups
- **GiveawayRepository**: Host-based and status filtering
- **GiveawayEntryRepository**: User and giveaway queries

## Error Handling

### Global Exception Handler
- `@RestControllerAdvice` for centralized error handling
- Returns standardized `ErrorResponse` DTOs
- **File**: `src/main/java/com/sweepgoat/backend/exception/GlobalExceptionHandler.java`

### Custom Exceptions
- `DuplicateResourceException` - 409 Conflict
- `ResourceNotFoundException` - 404 Not Found
- `InvalidCredentialsException` - 401 Unauthorized
- `EmailNotVerifiedException` - 403 Forbidden (special handling)
- `InvalidVerificationCodeException` - 400 Bad Request

## Development Workflow

### Running the Server
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
- Server: http://localhost:8081
- LiveReload: Port 35729 (auto-enabled)
- Auto-reload on file changes

### Database
```bash
# Start PostgreSQL
brew services start postgresql@16

# Check status
psql -p 5433 -U wilsonflores -d sweepgoat_dev
```

## DTOs (Data Transfer Objects)

### Request DTOs
- `HostRegisterRequest`, `HostLoginRequest`
- `UserRegisterRequest`, `UserLoginRequest`
- `VerifyEmailRequest`, `ResendVerificationRequest`
- `CreateGiveawayRequest`
- `GiveawayEntryRequest`

### Response DTOs
- `HostLoginResponse`, `UserLoginResponse`
- `GiveawayListResponse`, `GiveawayDetailsResponse`
- `GiveawayStatsResponse`
- `UserEntryResponse`, `GiveawayEntryLeaderboardResponse`
- `UserListResponse` (includes lastLoginAt)
- `MessageResponse`, `ErrorResponse`

**Location**: `src/main/java/com/sweepgoat/backend/dto/`

## Testing with Postman

### Environment Variables
```
baseUrl: http://localhost:8081
subdomain: your-subdomain
hostToken: <auto-saved after host login>
userToken: <auto-saved after user login>
```

### Headers
```
X-Subdomain: {{subdomain}}     # For subdomain-specific requests
Authorization: Bearer {{token}} # For protected endpoints
```

### Auto-save Token Script (Tests tab)
```javascript
// For login responses
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set("hostToken", response.token); // or userToken
    }
}
```

## Recent Changes (2025-10-23)

### User Management Features
1. **Last Login Tracking**
   - Added `lastLoginAt` field to User entity
   - Automatically updated on successful login
   - Visible to hosts in user list

2. **Host User List Endpoint**
   - New endpoint: `GET /api/host/users`
   - Returns all users on host's subdomain
   - Includes: email, name, phone, verification status, last login

3. **Account Deletion**
   - `DELETE /api/user/account` - Users can delete their own account
   - `DELETE /api/host/account` - Hosts can delete their account (cascade deletes all giveaways and users)

4. **Giveaway Management**
   - `POST /api/host/giveaways` - Create new giveaway
   - `GET /api/host/giveaways/active` - Filter for active giveaways only
   - `DELETE /api/host/giveaways/{id}` - Delete specific giveaway

## Common Patterns

### Extracting Auth Info from Request
```java
Long userId = (Long) request.getAttribute("userId");
Long hostId = (Long) request.getAttribute("hostId");
```

### Service Method Pattern
```java
@Transactional  // For write operations
public ResponseDTO methodName(RequestDTO request, Long authId) {
    // 1. Validate/find entities
    // 2. Check authorization (entity belongs to user/host)
    // 3. Perform business logic
    // 4. Save changes
    // 5. Return DTO
}
```

### DTO Mapping
```java
private ResponseDTO mapToDTO(Entity entity) {
    return new ResponseDTO(
        entity.getField1(),
        entity.getField2(),
        // ... all fields
    );
}
```

## Future Considerations

- Add pagination to list endpoints (users, giveaways, entries)
- Add sorting options for leaderboards
- Add filtering by date ranges
- Add winner selection functionality
- Add email notifications for giveaway events
- Add rate limiting for entry submissions
- Add bulk operations for hosts

## Files to Reference

### Core Configuration
- `src/main/java/com/sweepgoat/backend/config/SecurityConfig.java`
- `src/main/resources/application.properties`
- `src/main/resources/application-dev.properties`

### Main Application
- `src/main/java/com/sweepgoat/backend/SweepgoatBackendApplication.java`

### Controllers (API Layer)
- `src/main/java/com/sweepgoat/backend/controller/`

### Services (Business Logic)
- `src/main/java/com/sweepgoat/backend/service/`

### Models (Database Entities)
- `src/main/java/com/sweepgoat/backend/model/`

### Repositories (Data Access)
- `src/main/java/com/sweepgoat/backend/repository/`

---

**Note**: This project follows standard Spring Boot conventions. Most functionality can be found by following the package structure from controller → service → repository → model.