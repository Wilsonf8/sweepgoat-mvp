# Sweepgoat API - Complete Postman Testing Guide

## Setup

### 1. Create Collection
1. In Postman, create a new collection: **"Sweepgoat API Tests"**
2. Right-click collection → **Variables** tab
3. Add these collection variables:

```
baseUrl: http://localhost:8081
testSubdomain: testcompany
testHostEmail: host@testcompany.com
testHostPassword: SecurePass123!
testUserEmail: user@test.com
testUserPassword: UserPass123!
testUser2Email: user2@test.com

# Auto-populated by tests (leave empty):
hostToken
userToken
hostId
userId
giveawayId
verificationCode
```

### 2. Collection Pre-request Script (Optional)
Go to collection → **Pre-request Scripts** tab:
```javascript
// Automatically set subdomain header for requests
pm.request.headers.add({
    key: 'X-Subdomain',
    value: pm.collectionVariables.get('testSubdomain')
});
```

---

## Testing Plan Structure

### Phase 1: Setup & Registration
### Phase 2: Authentication Tests
### Phase 3: User Management
### Phase 4: Giveaway Operations
### Phase 5: Error Handling
### Phase 6: Cleanup

---

## Phase 1: SETUP & REGISTRATION

### Folder: "1. Registration & Verification"

#### 1.1 Register Host (Happy Path)
```
POST {{baseUrl}}/api/auth/host/register
Headers: (none - this is on main domain)
Body (JSON):
{
  "subdomain": "{{testSubdomain}}",
  "companyName": "Test Company Inc",
  "email": "{{testHostEmail}}",
  "password": "{{testHostPassword}}"
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has token", () => {
    const json = pm.response.json();
    pm.expect(json.token).to.exist;
    pm.collectionVariables.set("hostToken", json.token);
    pm.collectionVariables.set("hostId", json.id);
});
```

#### 1.2 Register Host - Duplicate Email (Error Test)
```
POST {{baseUrl}}/api/auth/host/register
Body: Same as 1.1

Tests:
pm.test("Status is 409 Conflict", () => pm.response.to.have.status(409));
pm.test("Error message mentions duplicate", () => {
    const json = pm.response.json();
    pm.expect(json.message.toLowerCase()).to.include("already exists");
});
```

#### 1.3 Register Host - Duplicate Subdomain (Error Test)
```
POST {{baseUrl}}/api/auth/host/register
Body (JSON):
{
  "subdomain": "{{testSubdomain}}",
  "companyName": "Another Company",
  "email": "different@email.com",
  "password": "{{testHostPassword}}"
}

Tests:
pm.test("Status is 409 Conflict", () => pm.response.to.have.status(409));
pm.test("Error message mentions subdomain taken", () => {
    const json = pm.response.json();
    pm.expect(json.message.toLowerCase()).to.include("subdomain");
});
```

#### 1.4 Register User (Happy Path)
```
POST {{baseUrl}}/api/auth/user/register
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "{{testUserEmail}}",
  "username": "testuser",
  "firstName": "Test",
  "lastName": "User",
  "phoneNumber": "555-1234",
  "password": "{{testUserPassword}}",
  "emailOptIn": true,
  "smsOptIn": false
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Verification message", () => {
    const json = pm.response.json();
    pm.expect(json.message).to.include("verification code");
});
```

#### 1.5 Register User - Duplicate Email on Same Subdomain (Error)
```
POST {{baseUrl}}/api/auth/user/register
Headers:
  X-Subdomain: {{testSubdomain}}
Body: Same as 1.4

Tests:
pm.test("Status is 409 Conflict", () => pm.response.to.have.status(409));
```

#### 1.6 Register User - Host Email (Error Test)
```
POST {{baseUrl}}/api/auth/user/register
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "{{testHostEmail}}",
  "username": "hostuser",
  "firstName": "Host",
  "lastName": "AsUser",
  "password": "{{testUserPassword}}"
}

Tests:
pm.test("Status is 409 Conflict", () => pm.response.to.have.status(409));
pm.test("Error prevents host from registering as user", () => {
    const json = pm.response.json();
    pm.expect(json.message.toLowerCase()).to.include("host cannot register");
});
```

#### 1.7 Verify Email (Manual Code Entry Required)
```
POST {{baseUrl}}/api/auth/user/verify-email
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "{{testUserEmail}}",
  "code": "123456"  // ⚠️ CHECK YOUR CONSOLE/EMAIL FOR ACTUAL CODE
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Verification success", () => {
    const json = pm.response.json();
    pm.expect(json.message.toLowerCase()).to.include("verified");
});
```

#### 1.8 Verify Email - Invalid Code (Error)
```
POST {{baseUrl}}/api/auth/user/verify-email
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "{{testUserEmail}}",
  "code": "000000"
}

Tests:
pm.test("Status is 400 Bad Request", () => pm.response.to.have.status(400));
```

#### 1.9 Resend Verification Code
```
POST {{baseUrl}}/api/auth/user/resend-verification
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "{{testUserEmail}}"
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

---

## Phase 2: AUTHENTICATION TESTS

### Folder: "2. Login Tests"

#### 2.1 Host Login (Happy Path)
```
POST {{baseUrl}}/api/auth/host/login
Body (JSON):
{
  "email": "{{testHostEmail}}",
  "password": "{{testHostPassword}}"
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has token and role", () => {
    const json = pm.response.json();
    pm.expect(json.token).to.exist;
    pm.expect(json.role).to.equal("HOST");
    pm.collectionVariables.set("hostToken", json.token);
    pm.collectionVariables.set("hostId", json.id);
});
```

#### 2.2 Host Login - Wrong Password (Error)
```
POST {{baseUrl}}/api/auth/host/login
Body (JSON):
{
  "email": "{{testHostEmail}}",
  "password": "WrongPassword123"
}

Tests:
pm.test("Status is 401 Unauthorized", () => pm.response.to.have.status(401));
pm.test("Invalid credentials message", () => {
    const json = pm.response.json();
    pm.expect(json.message.toLowerCase()).to.include("invalid");
});
```

#### 2.3 Host Login - Non-existent Email (Error)
```
POST {{baseUrl}}/api/auth/host/login
Body (JSON):
{
  "email": "nonexistent@host.com",
  "password": "{{testHostPassword}}"
}

Tests:
pm.test("Status is 401 Unauthorized", () => pm.response.to.have.status(401));
```

#### 2.4 User Login (Happy Path)
```
POST {{baseUrl}}/api/auth/user/login
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "{{testUserEmail}}",
  "password": "{{testUserPassword}}"
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has token and role", () => {
    const json = pm.response.json();
    pm.expect(json.token).to.exist;
    pm.expect(json.role).to.equal("USER");
    pm.collectionVariables.set("userToken", json.token);
    pm.collectionVariables.set("userId", json.id);
});
pm.test("Last login timestamp exists", () => {
    // User should have lastLoginAt set after login
    pm.expect(pm.response.json()).to.be.an('object');
});
```

#### 2.5 User Login - Unverified Email (Error)
```
# First register a new unverified user
POST {{baseUrl}}/api/auth/user/register
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "unverified@test.com",
  "username": "unverified",
  "firstName": "Unverified",
  "lastName": "User",
  "password": "Test123!"
}

# Then try to login
POST {{baseUrl}}/api/auth/user/login
Headers:
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "email": "unverified@test.com",
  "password": "Test123!"
}

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
pm.test("Email not verified message", () => {
    const json = pm.response.json();
    pm.expect(json.emailVerified).to.equal(false);
});
```

---

## Phase 3: USER MANAGEMENT

### Folder: "3. User Management (Host)"

#### 3.1 Get All Users (Host)
```
GET {{baseUrl}}/api/host/users
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Returns array of users", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an('array');
    pm.expect(json.length).to.be.at.least(1);
});
pm.test("User has lastLoginAt field", () => {
    const json = pm.response.json();
    const user = json.find(u => u.email === pm.collectionVariables.get('testUserEmail'));
    pm.expect(user).to.exist;
    pm.expect(user.lastLoginAt).to.exist;
});
```

#### 3.2 Get All Users - No Auth (Error)
```
GET {{baseUrl}}/api/host/users
Headers: (none)

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
```

#### 3.3 Get All Users - User Token (Error)
```
GET {{baseUrl}}/api/host/users
Headers:
  Authorization: Bearer {{userToken}}

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
pm.test("Wrong role rejected", () => {
    // User tokens shouldn't have access to host endpoints
});
```

---

## Phase 4: GIVEAWAY OPERATIONS

### Folder: "4. Giveaway Management"

#### 4.1 Create Giveaway (Host)
```
POST {{baseUrl}}/api/host/giveaways
Headers:
  Authorization: Bearer {{hostToken}}
Body (JSON):
{
  "title": "Test Giveaway - MacBook Pro",
  "description": "Win a brand new MacBook Pro!",
  "imageUrl": "https://example.com/macbook.jpg",
  "startDate": "2025-10-24T00:00:00",
  "endDate": "2025-11-24T23:59:59"
}

Tests:
pm.test("Status is 201 Created", () => pm.response.to.have.status(201));
pm.test("Giveaway created with ID", () => {
    const json = pm.response.json();
    pm.expect(json.id).to.exist;
    pm.collectionVariables.set("giveawayId", json.id);
    pm.expect(json.status).to.equal("ACTIVE");
});
```

#### 4.2 Create Giveaway - No Auth (Error)
```
POST {{baseUrl}}/api/host/giveaways
Headers: (none)
Body: Same as 4.1

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
```

#### 4.3 Get All Giveaways (Host)
```
GET {{baseUrl}}/api/host/giveaways
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Returns array with at least 1 giveaway", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an('array');
    pm.expect(json.length).to.be.at.least(1);
});
```

#### 4.4 Get Active Giveaways Only (Host)
```
GET {{baseUrl}}/api/host/giveaways/active
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("All giveaways are ACTIVE", () => {
    const json = pm.response.json();
    json.forEach(g => {
        pm.expect(g.status).to.equal("ACTIVE");
    });
});
```

#### 4.5 Get Giveaway Details (Host)
```
GET {{baseUrl}}/api/host/giveaways/{{giveawayId}}
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has detailed fields", () => {
    const json = pm.response.json();
    pm.expect(json.title).to.exist;
    pm.expect(json.totalEntries).to.exist;
});
```

#### 4.6 Get Giveaway Stats (Host)
```
GET {{baseUrl}}/api/host/giveaways/{{giveawayId}}/stats
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has stats fields", () => {
    const json = pm.response.json();
    pm.expect(json.totalEntries).to.exist;
    pm.expect(json.totalPoints).to.exist;
    pm.expect(json.uniqueUsers).to.exist;
});
```

#### 4.7 List Public Giveaways (No Auth)
```
GET {{baseUrl}}/api/public/giveaways
Headers:
  X-Subdomain: {{testSubdomain}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Public can view active giveaways", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an('array');
});
```

#### 4.8 Get Public Giveaway Details (No Auth)
```
GET {{baseUrl}}/api/public/giveaways/{{giveawayId}}
Headers:
  X-Subdomain: {{testSubdomain}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

#### 4.9 Enter Giveaway (User)
```
POST {{baseUrl}}/api/user/giveaways/{{giveawayId}}/enter
Headers:
  Authorization: Bearer {{userToken}}
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "points": 1,
  "isFreeEntry": true
}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Entry created successfully", () => {
    const json = pm.response.json();
    pm.expect(json.message).to.include("success");
});
```

#### 4.10 Enter Giveaway - Duplicate Free Entry (Error)
```
POST {{baseUrl}}/api/user/giveaways/{{giveawayId}}/enter
Headers:
  Authorization: Bearer {{userToken}}
  X-Subdomain: {{testSubdomain}}
Body (JSON):
{
  "points": 1,
  "isFreeEntry": true
}

Tests:
pm.test("Status is 400 Bad Request", () => pm.response.to.have.status(400));
pm.test("Already claimed free entry", () => {
    const json = pm.response.json();
    pm.expect(json.message.toLowerCase()).to.include("already claimed");
});
```

#### 4.11 Get My Entries (User)
```
GET {{baseUrl}}/api/user/my-entries
Headers:
  Authorization: Bearer {{userToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has at least one entry", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an('array');
    pm.expect(json.length).to.be.at.least(1);
});
```

#### 4.12 View Leaderboard (Host)
```
GET {{baseUrl}}/api/host/giveaways/{{giveawayId}}/entries
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Leaderboard has entries", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an('array');
});
```

---

## Phase 5: ERROR HANDLING

### Folder: "5. Error Scenarios"

#### 5.1 Access Host Endpoint with User Token
```
GET {{baseUrl}}/api/host/giveaways
Headers:
  Authorization: Bearer {{userToken}}

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
```

#### 5.2 Access User Endpoint with Host Token
```
GET {{baseUrl}}/api/user/my-entries
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
```

#### 5.3 Invalid JWT Token
```
GET {{baseUrl}}/api/host/giveaways
Headers:
  Authorization: Bearer invalid.token.here

Tests:
pm.test("Status is 403 Forbidden", () => pm.response.to.have.status(403));
```

#### 5.4 Missing Required Fields
```
POST {{baseUrl}}/api/host/giveaways
Headers:
  Authorization: Bearer {{hostToken}}
Body (JSON):
{
  "title": "Missing Fields"
}

Tests:
pm.test("Status is 400 Bad Request", () => pm.response.to.have.status(400));
```

#### 5.5 Access Non-existent Resource
```
GET {{baseUrl}}/api/host/giveaways/999999
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 404 Not Found", () => pm.response.to.have.status(404));
```

---

## Phase 6: CLEANUP (Run Last)

### Folder: "6. Cleanup - Run Last"

#### 6.1 Delete Giveaway
```
DELETE {{baseUrl}}/api/host/giveaways/{{giveawayId}}
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

#### 6.2 Delete User Account
```
DELETE {{baseUrl}}/api/user/account
Headers:
  Authorization: Bearer {{userToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

#### 6.3 Delete Unverified User (if created)
```
# You'll need to login as this user first or use admin endpoint
# For now, this will be manual cleanup
```

#### 6.4 Delete Host Account (Last!)
```
DELETE {{baseUrl}}/api/host/account
Headers:
  Authorization: Bearer {{hostToken}}

Tests:
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Cleanup complete", () => {
    // This will cascade delete all giveaways and users
    console.log("✅ All test data cleaned up!");
});
```

---

## Running the Tests

### Method 1: Manual (Recommended First Time)
1. Go through each folder in order
2. Run each request one by one
3. Verify responses
4. Check that variables are being set correctly

### Method 2: Collection Runner
1. Click on collection → **Run**
2. Select all folders
3. Click **Run Sweepgoat API Tests**
4. Watch the tests execute
5. ⚠️ **Note**: You'll need to manually enter the verification code in request 1.7

### Method 3: Newman (CLI)
```bash
newman run Sweepgoat-API-Tests.postman_collection.json \
  -e Sweepgoat-Environment.postman_environment.json
```

---

## Tips for Rerunning Tests

1. **Always run Phase 6 (Cleanup) first** before starting a new test run
2. **Check verification codes** in your console logs for request 1.7
3. **Update collection variables** if you want to use different test data
4. **Check database** manually if tests fail:
   ```sql
   SELECT * FROM hosts WHERE subdomain = 'testcompany';
   SELECT * FROM users WHERE email = 'user@test.com';
   ```

---

## Common Issues

### Issue: "409 Conflict - Email already exists"
**Solution**: Run Phase 6 cleanup requests first

### Issue: "Verification code not found"
**Solution**: Check console output for the actual 6-digit code

### Issue: "403 Forbidden"
**Solution**: Check that token was saved correctly in variables

### Issue: "404 Subdomain not found"
**Solution**: Verify X-Subdomain header is set correctly

---

## Summary

This test plan covers:
- ✅ 40+ test scenarios
- ✅ Happy paths for all major features
- ✅ Error handling and edge cases
- ✅ Authentication and authorization
- ✅ Complete cleanup for reusability

**Total Requests**: ~40
**Total Time**: ~5-10 minutes (manual)
**Automation**: Can be mostly automated (except verification code entry)