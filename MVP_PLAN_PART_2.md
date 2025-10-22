# Sweepgoat Backend MVP - Part 2 Plan

## Architecture Overview

### Multi-Domain Strategy
- **sweepgoat.com** (Main Domain) - Host management portal
  - Hosts register and login here
  - Hosts manage their subdomains (create/delete)
  - Each host can have MULTIPLE subdomains

- **{subdomain}.sweepgoat.com** - User-facing portals
  - Users can ONLY register/login on subdomains
  - Each subdomain is a SEPARATE entity with its own:
    - Users
    - Giveaways
    - Entries
  - Completely isolated from other subdomains

### Authentication Flow

**Host Flow:**
1. Register on `sweepgoat.com/api/auth/host/register`
2. Login on `sweepgoat.com/api/auth/host/login`
3. Create subdomain(s) via dashboard: `testhost1.sweepgoat.com`
4. **Login to subdomain**: `testhost1.sweepgoat.com/api/auth/host/login`
5. **Access CRM Dashboard** to manage that subdomain:
   - View all giveaways for that subdomain
   - View all participants in each giveaway
   - Start/end giveaways
   - View participant points
   - Use random winner generator

**User Flow:**
1. Visit a subdomain: `testhost1.sweepgoat.com`
2. Register: `testhost1.sweepgoat.com/api/auth/user/register`
3. Login: `testhost1.sweepgoat.com/api/auth/user/login`
4. Enter giveaways on that specific subdomain

---

## Phase 3: Database Schema Updates

### 1. Create Subdomains Table

**New Entity: Subdomain**
- id (Primary Key)
- host_id (Foreign Key → hosts.id)
- subdomain (unique) - e.g., "testhost1"
- is_active (Boolean, default: true)
- created_at
- updated_at

**Relationship:** One Host → Many Subdomains

### 2. Update Existing Schema

**Modify `users` table:**
- Add `subdomain_id` (Foreign Key → subdomains.id) instead of `host_id`
- Add `email_verified` (Boolean, default: false) - User must verify email before logging in
- Add `verification_token` (String, nullable) - Token sent in verification email
- Add `verification_token_expires_at` (Timestamp, nullable) - Token expiration (24 hours)
- Constraint: Ensure user email doesn't match host email of the subdomain they're registering on

**Modify `giveaways` table:**
- Add `subdomain_id` (Foreign Key → subdomains.id)
- This ensures complete isolation between subdomains

---

## Phase 4: Authentication & Authorization API

### 3. Create DTOs (Data Transfer Objects)

#### Authentication DTOs
- **LoginRequest** - `{ email, password }`
- **LoginResponse** - `{ token, userType, email, hostId?, subdomainId?, subdomain?, emailVerified? }`
- **LoginResponseUnverified** - `{ emailVerified: false, email, message: "Please verify your email" }` - Returned when login with unverified email
- **RegisterHostRequest** - `{ companyName, email, password }`
- **RegisterUserRequest** - `{ email, username, firstName, lastName, password, emailOptIn, smsOptIn }`
- **VerifyEmailRequest** - `{ email, code }` - Used to verify email with 6-digit code
- **ResendVerificationRequest** - `{ email }` - Request to resend verification code

#### Subdomain Management DTOs
- **CreateSubdomainRequest** - `{ subdomain, logoUrl?, primaryColor? }`
- **SubdomainResponse** - `{ id, subdomain, hostId, isActive, createdAt }`
- **SubdomainListResponse** - List of subdomains for a host

#### Error DTOs
- **ErrorResponse** - `{ timestamp, status, error, message, path }`
- **ValidationErrorResponse** - For validation failures

### 4. Create Authentication Service Layer

#### HostAuthService
- `registerHost()` - Create new host account
  - Validate email is unique
  - Hash password with BCrypt
  - Save to database
  - Return success (NO subdomain created yet)
  - **ONLY allowed on main domain (no subdomain)**

- `authenticateHost()` - Login for hosts (works on BOTH main domain AND subdomains)
  - Find host by email
  - Verify password
  - Generate JWT token with HOST role
  - Include subdomain info in token if logging into subdomain
  - Return token + host info
  - **Purpose varies by domain:**
    - On `sweepgoat.com`: Token allows subdomain management ONLY
    - On `{subdomain}.sweepgoat.com`: Token allows CRM access for that subdomain

#### UserAuthService
- `registerUser(subdomainId)` - Create new user account
  - Validate subdomain is active
  - **Validate user email is NOT the host's email** (hosts can't register as users on their own subdomains)
  - Validate email/username unique within subdomain
  - Hash password with BCrypt
  - Generate email verification token (UUID)
  - Set verification token expiration (24 hours)
  - Link to subdomain via subdomain_id
  - Save to database with `email_verified = false`
  - **Send verification email** with link containing token
  - Return success message

- `verifyEmail(token)` - Verify user's email address
  - Find user by verification token
  - Check token hasn't expired
  - Set `email_verified = true`
  - Clear verification token
  - Return success message

- `resendVerificationEmail(email, subdomainId)` - Resend verification email
  - Find user by email AND subdomain_id
  - Check if already verified
  - Generate new verification token
  - Update expiration
  - Send verification email

- `authenticateUser(subdomainId)` - Login for users on subdomains
  - Verify subdomain present in request
  - Find user by email AND subdomain_id (multi-tenant!)
  - **Check if email is verified** - Reject if not verified
  - Verify password
  - Generate JWT token with USER role
  - Return token + user info

#### SubdomainService
- `createSubdomain(hostId, subdomain)` - Create new subdomain
  - Validate subdomain format (alphanumeric, lowercase)
  - Validate subdomain is unique globally
  - Link to host
  - Save to database

- `getSubdomainsByHost(hostId)` - List all host's subdomains
- `deleteSubdomain(hostId, subdomainId)` - Soft delete subdomain
- `getSubdomainByName(subdomain)` - Find subdomain entity

### 5. Create Authentication Controllers

#### HostAuthController (`/api/auth/host`)
**IMPORTANT: Accessible on BOTH main domain AND subdomains**
- `POST /api/auth/host/register` - Register new host (ONLY on main domain)
- `POST /api/auth/host/login` - Host login
  - On `sweepgoat.com`: Access subdomain management
  - On `{subdomain}.sweepgoat.com`: Access CRM dashboard for that subdomain

#### UserAuthController (`/api/auth/user`)
**IMPORTANT: Only accessible on subdomains**
- `POST /api/auth/user/register` - Register new user
  - Returns: "Registration successful! Please check your email to verify your account."
- `POST /api/auth/user/login` - User login
  - Rejects with 403 if email not verified
- `GET /api/auth/user/verify-email?token={token}` - Verify email address
  - Returns: "Email verified successfully! You can now login."
- `POST /api/auth/user/resend-verification` - Resend verification email
  - Body: `{ email }`
  - Returns: "Verification email sent!"

#### SubdomainController (`/api/hosts/subdomains`)
**IMPORTANT: Only accessible on main domain (HOST authenticated)**
**This is the ONLY feature available to hosts on sweepgoat.com**
- `POST /api/hosts/subdomains` - Create subdomain
- `GET /api/hosts/subdomains` - List host's subdomains
- `DELETE /api/hosts/subdomains/{id}` - Delete subdomain

### 6. Domain Validation & Security

#### Update SubdomainExtractor
- Add method: `isMainDomain()` - Returns true if no subdomain
- Add method: `isSubdomain()` - Returns true if subdomain exists

#### Create Domain Validation Interceptor
- **Host Registration:** Reject if subdomain present (ONLY on main domain)
- **Host Login:** Allow on BOTH main domain AND subdomains
- **User endpoints:** Reject if on main domain (ONLY on subdomains)
- **Subdomain Management:** Reject if on subdomain (ONLY on main domain)
- **CRM endpoints:** Reject if on main domain (ONLY on subdomains)
- Return 403 Forbidden with helpful error message

### 7. Exception Handling
Create global exception handler (`@RestControllerAdvice`):
- `UserNotFoundException`
- `HostNotFoundException`
- `SubdomainNotFoundException`
- `DuplicateEmailException`
- `DuplicateSubdomainException`
- `InvalidCredentialsException`
- `InvalidDomainException` - Wrong domain for operation
- `EmailNotVerifiedException` - User trying to login without verifying email
- `VerificationTokenExpiredException` - Email verification token expired
- `HostEmailConflictException` - User trying to register with host's email on host's subdomain
- `MethodArgumentNotValidException` - Validation errors

---

## Phase 5: Core Business Logic API

### 8. Update Services for Subdomain Isolation

#### GiveawayService
- `createGiveaway(subdomainId)` - Create giveaway for subdomain
- `getGiveawaysBySubdomain(subdomainId)` - List giveaways
- `getActiveGiveaways(subdomainId)` - Active giveaways only
- `getGiveawayById(id, subdomainId)` - Get single giveaway (validate subdomain)
- `updateGiveaway(id, subdomainId)` - Update giveaway
- `deleteGiveaway(id, subdomainId)` - Delete giveaway
- `selectWinner(id, subdomainId)` - Select random winner

#### GiveawayEntryService
- `enterGiveaway(userId, giveawayId, subdomainId)` - Enter giveaway
  - Validate user and giveaway belong to same subdomain
  - Check if already entered
  - Create entry with initial points

- `addPoints(userId, giveawayId, points)` - Add points
- `getEntriesByGiveaway(giveawayId, subdomainId)` - List entries
- `getEntriesByUser(userId, subdomainId)` - User's entries
- `getLeaderboard(giveawayId, subdomainId)` - Sorted by points

### 9. Create DTOs for Business Logic

#### Giveaway DTOs
- **CreateGiveawayRequest** - `{ title, description, imageUrl, startDate, endDate }`
- **UpdateGiveawayRequest** - `{ title, description, imageUrl, endDate }`
- **GiveawayResponse** - Full details with entry count, subdomain info
- **GiveawayListResponse** - Simplified for lists

#### Entry DTOs
- **EnterGiveawayRequest** - `{ giveawayId }`
- **AddPointsRequest** - `{ giveawayId, points }`
- **GiveawayEntryResponse** - Entry with user info
- **LeaderboardResponse** - Top entries sorted by points

### 10. Create Controllers for Core Logic

#### GiveawayController (`/api/giveaways`)
**Accessible on subdomains only**
- `POST /api/giveaways` - Create giveaway (HOST only)
- `GET /api/giveaways` - List giveaways for current subdomain
- `GET /api/giveaways/{id}` - Get giveaway details
- `PUT /api/giveaways/{id}` - Update (HOST only)
- `DELETE /api/giveaways/{id}` - Delete (HOST only)
- `POST /api/giveaways/{id}/select-winner` - Select winner (HOST only)

#### GiveawayEntryController (`/api/entries`)
**Accessible on subdomains only**
- `POST /api/entries/enter` - Enter giveaway (USER only)
- `POST /api/entries/add-points` - Add points (USER only)
- `GET /api/entries/giveaway/{giveawayId}` - All entries
- `GET /api/entries/my-entries` - Current user's entries
- `GET /api/entries/leaderboard/{giveawayId}` - Leaderboard

---

## Phase 6: CRM Dashboard API (Host Management on Subdomains)

### 11. Create CRM Dashboard Controller

#### CRMDashboardController (`/api/crm`)
**IMPORTANT: Only accessible on subdomains with HOST authentication**

**Dashboard Overview:**
- `GET /api/crm/dashboard` - Get dashboard statistics
  - Total active giveaways
  - Total participants across all giveaways
  - Recent activity

**Giveaway Management:**
- `GET /api/crm/giveaways` - List all giveaways for this subdomain (with participant counts)
- `GET /api/crm/giveaways/{id}` - Get detailed giveaway info with all participants
- `POST /api/crm/giveaways` - Create new giveaway
- `PUT /api/crm/giveaways/{id}` - Update giveaway
- `POST /api/crm/giveaways/{id}/start` - Start giveaway (change status to ACTIVE)
- `POST /api/crm/giveaways/{id}/end` - End giveaway (change status to ENDED)
- `DELETE /api/crm/giveaways/{id}` - Delete giveaway

**Participant Management:**
- `GET /api/crm/giveaways/{id}/participants` - List all participants with their points
- `GET /api/crm/giveaways/{id}/participants/{userId}` - Get specific participant details
- `PUT /api/crm/giveaways/{id}/participants/{userId}/points` - Manually adjust points (admin override)

**Winner Selection:**
- `POST /api/crm/giveaways/{id}/select-winner` - Randomly select winner
  - Algorithm: Weighted random based on points
  - More points = higher chance of winning
  - Returns winner info and updates giveaway.winner_id

- `GET /api/crm/giveaways/{id}/winner` - Get selected winner for ended giveaway

**Analytics & Reports:**
- `GET /api/crm/analytics/participants` - Get participant statistics for subdomain
  - Total users registered
  - Active participants
  - Engagement metrics

- `GET /api/crm/analytics/giveaways/{id}` - Get detailed giveaway analytics
  - Total entries
  - Average points per participant
  - Participation timeline

### 12. Create CRM Service Layer

#### CRMDashboardService
- `getDashboardStats(subdomainId)` - Calculate dashboard statistics
- `getAllGiveawaysWithStats(subdomainId)` - Giveaways with participant counts
- `getGiveawayParticipants(giveawayId, subdomainId)` - All participants with points
- `startGiveaway(giveawayId, subdomainId)` - Activate giveaway
- `endGiveaway(giveawayId, subdomainId)` - End giveaway
- `selectRandomWinner(giveawayId, subdomainId)` - Weighted random selection
- `manuallyAdjustPoints(giveawayId, userId, newPoints, subdomainId)` - Admin point adjustment
- `getSubdomainAnalytics(subdomainId)` - Participant and engagement stats
- `getGiveawayAnalytics(giveawayId, subdomainId)` - Detailed giveaway metrics

### 13. Create CRM DTOs

#### Dashboard DTOs
- **DashboardStatsResponse** - `{ totalGiveaways, totalParticipants, activeGiveaways, recentActivity[] }`
- **GiveawayWithStatsResponse** - `{ giveaway, participantCount, totalPoints, status }`

#### Participant DTOs
- **ParticipantDetailResponse** - `{ userId, username, email, points, hasFreeEntry, enteredAt }`
- **ParticipantListResponse** - Array of participants sorted by points
- **AdjustPointsRequest** - `{ points, reason }`

#### Winner Selection DTOs
- **WinnerSelectionResponse** - `{ winnerId, username, email, points, selectionDate }`
- **WinnerRequest** - (empty body for POST)

#### Analytics DTOs
- **SubdomainAnalyticsResponse** - `{ totalUsers, activeParticipants, engagementRate, topGiveaways[] }`
- **GiveawayAnalyticsResponse** - `{ giveawayId, title, totalEntries, avgPoints, participationTimeline[] }`

### 14. Random Winner Selection Algorithm

**Weighted Random Selection:**
```
Algorithm:
1. Get all entries for giveaway
2. Calculate total points across all entries
3. Generate random number between 0 and total points
4. Iterate through entries, accumulating points
5. Select entry where accumulated points >= random number
6. Return winner
```

**Example:**
- User A: 10 points
- User B: 30 points
- User C: 60 points
- Total: 100 points

User C has 60% chance, User B has 30% chance, User A has 10% chance

---

## Phase 7: Local Development Setup

### Option 1: Edit /etc/hosts (Recommended)
```bash
# Add to /etc/hosts
127.0.0.1 sweepgoat.com
127.0.0.1 testhost1.sweepgoat.com
127.0.0.1 testhost2.sweepgoat.com
```

Then access:
- `http://sweepgoat.com:8081` - Main domain
- `http://testhost1.sweepgoat.com:8081` - Subdomain

### Option 2: Use X-Subdomain Header
Continue using `X-Subdomain` header in Postman:
- No header = main domain
- `X-Subdomain: testhost1` = subdomain

---

## Phase 7: Testing with Postman

### Test Collection 1: Host Management on Main Domain (sweepgoat.com)
1. **Register Host**
   - `POST http://sweepgoat.com:8081/api/auth/host/register`
   - Body: `{ companyName: "Test Company", email: "host@test.com", password: "password123" }`
   - Expected: 201 Created

2. **Login Host on Main Domain**
   - `POST http://sweepgoat.com:8081/api/auth/host/login`
   - Body: `{ email: "host@test.com", password: "password123" }`
   - Expected: 200 OK + JWT token (save as host_main_token)
   - **This token can ONLY create/delete subdomains**

3. **Create Subdomain**
   - `POST http://sweepgoat.com:8081/api/hosts/subdomains`
   - Headers: `Authorization: Bearer {host_main_token}`
   - Body: `{ subdomain: "testhost1" }`
   - Expected: 201 Created

4. **List Subdomains**
   - `GET http://sweepgoat.com:8081/api/hosts/subdomains`
   - Headers: `Authorization: Bearer {host_main_token}`
   - Expected: 200 OK + array of subdomains

5. **Try to Access CRM on Main Domain (Should Fail)**
   - `GET http://sweepgoat.com:8081/api/crm/dashboard`
   - Headers: `Authorization: Bearer {host_main_token}`
   - Expected: 403 Forbidden (CRM only available on subdomains)

### Test Collection 2: User Authentication & Email Verification (Subdomain)
1. **Try to Register with Host's Email (Should Fail)**
   - `POST http://testhost1.sweepgoat.com:8081/api/auth/user/register`
   - Body: `{ email: "host@test.com", username: "testuser", firstName: "John", lastName: "Doe", password: "password123" }`
   - Expected: 409 Conflict (Host email can't register as user on their own subdomain)

2. **Register User with Different Email**
   - `POST http://testhost1.sweepgoat.com:8081/api/auth/user/register`
   - Body: `{ email: "user@test.com", username: "testuser", firstName: "John", lastName: "Doe", password: "password123" }`
   - Expected: 201 Created + "Please check your email to verify your account"

3. **Try Login Before Email Verification (Should Fail)**
   - `POST http://testhost1.sweepgoat.com:8081/api/auth/user/login`
   - Body: `{ email: "user@test.com", password: "password123" }`
   - Expected: 403 Forbidden + "Please verify your email address before logging in"

4. **Verify Email**
   - `GET http://testhost1.sweepgoat.com:8081/api/auth/user/verify-email?token={token_from_email}`
   - Expected: 200 OK + "Email verified successfully"

5. **Login User After Verification**
   - `POST http://testhost1.sweepgoat.com:8081/api/auth/user/login`
   - Body: `{ email: "user@test.com", password: "password123" }`
   - Expected: 200 OK + JWT token

6. **Resend Verification Email**
   - `POST http://testhost1.sweepgoat.com:8081/api/auth/user/resend-verification`
   - Body: `{ email: "user@test.com" }`
   - Expected: 200 OK + "Verification email sent"

7. **Try Invalid Domain Access**
   - `POST http://sweepgoat.com:8081/api/auth/user/register`
   - Expected: 403 Forbidden (users can't register on main domain)

### Test Collection 3: Giveaway Flow
1. **Host Creates Giveaway**
   - `POST http://testhost1.sweepgoat.com:8081/api/giveaways`
   - Headers: `Authorization: Bearer {host_token}`
   - Body: `{ title: "Win a MacBook", description: "...", startDate: "2025-11-01", endDate: "2025-11-30" }`
   - Expected: 201 Created

2. **User Enters Giveaway**
   - `POST http://testhost1.sweepgoat.com:8081/api/entries/enter`
   - Headers: `Authorization: Bearer {user_token}`
   - Body: `{ giveawayId: 1 }`
   - Expected: 201 Created

3. **User Adds Points**
   - `POST http://testhost1.sweepgoat.com:8081/api/entries/add-points`
   - Headers: `Authorization: Bearer {user_token}`
   - Body: `{ giveawayId: 1, points: 10 }`
   - Expected: 200 OK

4. **View Leaderboard**
   - `GET http://testhost1.sweepgoat.com:8081/api/entries/leaderboard/1`
   - Expected: 200 OK + sorted entries

### Test Collection 4: CRM Dashboard (Host on Subdomain)
1. **Host Logs into Subdomain**
   - `POST http://testhost1.sweepgoat.com:8081/api/auth/host/login`
   - Body: `{ email: "host@test.com", password: "password123" }`
   - Expected: 200 OK + JWT token (save as host_subdomain_token)

2. **Get Dashboard Statistics**
   - `GET http://testhost1.sweepgoat.com:8081/api/crm/dashboard`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + `{ totalGiveaways, totalParticipants, activeGiveaways }`

3. **View All Giveaways with Participant Counts**
   - `GET http://testhost1.sweepgoat.com:8081/api/crm/giveaways`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + array of giveaways with stats

4. **View Giveaway Participants**
   - `GET http://testhost1.sweepgoat.com:8081/api/crm/giveaways/1/participants`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + array of participants with points

5. **Start Giveaway**
   - `POST http://testhost1.sweepgoat.com:8081/api/crm/giveaways/1/start`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + giveaway status changed to ACTIVE

6. **End Giveaway**
   - `POST http://testhost1.sweepgoat.com:8081/api/crm/giveaways/1/end`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + giveaway status changed to ENDED

7. **Select Random Winner**
   - `POST http://testhost1.sweepgoat.com:8081/api/crm/giveaways/1/select-winner`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + `{ winnerId, username, email, points }`

8. **Get Selected Winner**
   - `GET http://testhost1.sweepgoat.com:8081/api/crm/giveaways/1/winner`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Expected: 200 OK + winner details

9. **Manually Adjust Points**
   - `PUT http://testhost1.sweepgoat.com:8081/api/crm/giveaways/1/participants/2/points`
   - Headers: `Authorization: Bearer {host_subdomain_token}`
   - Body: `{ points: 50, reason: "Bonus points for sharing" }`
   - Expected: 200 OK + updated participant

10. **View Subdomain Analytics**
    - `GET http://testhost1.sweepgoat.com:8081/api/crm/analytics/participants`
    - Headers: `Authorization: Bearer {host_subdomain_token}`
    - Expected: 200 OK + engagement metrics

---

## Validation Rules
- Email format validation
- Password minimum 8 characters
- Subdomain: alphanumeric, lowercase, 3-20 characters
- Dates: end date must be after start date
- Points: positive integers only
- Required field validation
- **Host email cannot register as user on their own subdomain**
- **User must verify email before login**
- Verification token expires after 24 hours

---

## Implementation Order
1. Create Subdomain entity and repository
2. Create DTOs (all requests/responses)
3. Create exception classes
4. Create global exception handler
5. Update SubdomainExtractor with domain validation
6. Create domain validation interceptor
7. Create SubdomainService
8. Create HostAuthService
9. Create UserAuthService
10. Create authentication controllers
11. **CHECKPOINT: Test auth in Postman**
12. Create SubdomainController
13. **CHECKPOINT: Test subdomain management**
14. Create GiveawayService
15. Create GiveawayEntryService
16. Create business logic controllers
17. **FINAL CHECKPOINT: Test full flow**

---

## Verification Steps (Part 2)
- ✅ Subdomain entity created and linked to hosts
- ✅ Domain validation enforces correct access patterns
- ✅ Host can register/login on main domain only
- ✅ User can register/login on subdomains only
- ✅ **Host email blocked from registering as user on their own subdomain**
- ✅ **Email verification required before login**
- ✅ **Verification emails sent successfully**
- ✅ **Verification token expiration works (24 hours)**
- ✅ Host can create/manage multiple subdomains
- ✅ Users isolated per subdomain (can't see other subdomain data)
- ✅ JWT tokens contain correct subdomain info
- ✅ All endpoints tested in Postman
- ✅ Password hashing works (BCrypt)
- ✅ Validation errors return 400 with details
- ✅ Domain access violations return 403

---

## Next Steps After Part 2
- Campaign/CRM email system integration
- Winner selection algorithm (weighted random by points) - **INCLUDED IN PART 2**
- SMS integration (Twilio)
- Email service integration (SendGrid/AWS SES) for verification emails
- Image upload to Cloudflare
- Password reset functionality
- Admin panel UI
- User-facing frontend

## Email Service Requirements (Part 2)

### Email Templates Needed:
1. **User Email Verification**
   - Subject: "Verify your email for {subdomain_name}"
   - Contains: Verification link with token
   - Expires: 24 hours

2. **Verification Email Resend**
   - Same as above, new token generated

### Email Service Setup:
- Use SendGrid, AWS SES, or similar
- Configure SMTP settings in application.properties
- Create email templates with subdomain branding (logo, colors)
- Include verification link: `http://{subdomain}.sweepgoat.com/verify-email?token={token}`