# CRM Marketing Campaign Feature - Implementation Plan

**Date**: 2025-10-25
**Status**: In Progress

## Overview

Add email broadcast feature for hosts to send personalized marketing emails to filtered users. Uses existing `Campaign` and `CampaignLog` models. Architected for easy multi-channel expansion (SMS in future).

## Current State

### Existing Models (Already Done ✅)
- **Campaign.java** - Multi-channel ready (EMAIL, SMS, BOTH)
- **CampaignLog.java** - Provider-ready tracking with externalId for SendGrid/Twilio

### What's New
- Add `filtersJson` field to Campaign model
- Create marketing campaign service and endpoint
- Console logging for MVP → Easy SendGrid migration later

## Template Variables (4 total)

Support for personalization:
- `{{firstName}}` → user.getFirstName()
- `{{lastName}}` → user.getLastName()
- `{{hostCompanyName}}` → host.getCompanyName()
- `{{subdomain}}` → host.getSubdomain() ← For website links!

**Example:**
```
Subject: {{firstName}}, Check Your Giveaway Status!

Hi {{firstName}} {{lastName}},

Great news from {{hostCompanyName}}!

Visit: https://{{subdomain}}.sweepgoat.com

Thanks!
```

## API Endpoint

### POST /api/host/campaigns/send

**Request:**
```json
{
  "name": "Giveaway Reminder Campaign",
  "type": "EMAIL",
  "subject": "{{firstName}}, Check Your Status!",
  "message": "Hi {{firstName}} {{lastName}},\n\nVisit https://{{subdomain}}.sweepgoat.com\n\nThanks,\n{{hostCompanyName}}",
  "giveawayId": 1,
  "emailVerified": true,
  "emailOptIn": true,
  "smsOptIn": null,
  "sortBy": "firstName",
  "sortOrder": "asc"
}
```

**Response:**
```json
{
  "campaignId": 123,
  "name": "Giveaway Reminder Campaign",
  "type": "EMAIL",
  "totalRecipients": 45,
  "totalSent": 45,
  "totalFailed": 0,
  "sentAt": "2025-10-25T22:30:00",
  "status": "SENT",
  "message": "Campaign sent successfully to 45 users"
}
```

## Implementation Checklist

### Database Changes
- [x] Add `filtersJson` field to Campaign.java
- [ ] Hibernate will auto-create column on next startup

### New Files to Create (6)

1. **CampaignRepository.java** - `src/main/java/com/sweepgoat/backend/repository/`
   - findByHostIdOrderByCreatedAtDesc()
   - findByIdAndHostId()

2. **CampaignLogRepository.java** - `src/main/java/com/sweepgoat/backend/repository/`
   - findByCampaignId()
   - findByUserId()

3. **SendCampaignRequest.java** - `src/main/java/com/sweepgoat/backend/dto/`
   - Campaign details (name, type, subject, message)
   - Filter parameters (giveawayId, emailVerified, emailOptIn, smsOptIn, sortBy, sortOrder)

4. **SendCampaignResponse.java** - `src/main/java/com/sweepgoat/backend/dto/`
   - Campaign stats (campaignId, name, type, totalRecipients, totalSent, totalFailed, status)

5. **MarketingCampaignService.java** - `src/main/java/com/sweepgoat/backend/service/`
   - sendCampaign() - Main method
   - replaceVariables() - Template variable replacement
   - sendEmail() - Console logging (MVP) / SendGrid (future)
   - buildFiltersJson() - Convert filter params to JSON string

6. **HostCampaignController.java** - `src/main/java/com/sweepgoat/backend/controller/`
   - POST /api/host/campaigns/send
   - GET /api/host/campaigns (future)
   - GET /api/host/campaigns/{id} (future)

## Implementation Flow

1. Host sends POST request with campaign details + filters
2. **MarketingCampaignService.sendCampaign()**:
   - Get filtered users (reuse `UserAuthService.getUsersByHostId()`)
   - Create Campaign record (status = SENDING)
   - Convert filters to JSON and store in `filtersJson`
   - For each user:
     - Replace template variables
     - Send email (console log for MVP)
     - Create CampaignLog record (type = EMAIL, status = SENT)
   - Update Campaign (status = SENT, totalSent, totalFailed, sentAt)
   - Return SendCampaignResponse

## Security

- ✅ HOST authentication required
- ✅ Only email users from authenticated host's subdomain
- ✅ Validate giveawayId belongs to host (reuse existing logic)
- ✅ Respect user opt-in preferences (filter by emailOptIn/smsOptIn)

## Multi-Channel Architecture (No Redundancy!)

### Current (MVP)
- Campaign.type = "EMAIL"
- Console logging

### Future - Add SMS
- Campaign.type = "SMS" or "BOTH"
- Add SMS sending logic to MarketingCampaignService
- CampaignLog.type tracks which channel was used

**No duplicate code needed!** One Campaign model handles all channels.

## Provider Migration Path

### Now: Console Logging
```java
logger.info("=== MARKETING EMAIL ===");
logger.info("To: " + user.getEmail());
logger.info("Subject: " + subject);
logger.info("Body: " + body);
logger.info("======================");
```

### Future: SendGrid (Easy Swap)
```java
// 1. Add dependency to pom.xml
// 2. Add SENDGRID_API_KEY to environment
// 3. Replace sendEmail() method:
Mail mail = new Mail(from, subject, to, content);
Response response = sendGrid.api(request);
// 4. Store response.getMessageId() in CampaignLog.externalId
```

### Future: SMS with Twilio
```java
Message message = Message.creator(
    new PhoneNumber(user.getPhoneNumber()),
    new PhoneNumber(twilioNumber),
    personalizedMessage
).create();
// Store message.getSid() in CampaignLog.externalId
```

## Testing Plan

### Postman Tests (7 tests)

1. **Send to all users** - No filters
2. **Send to giveaway participants** - `giveawayId=1`
3. **Send to email opt-ins only** - `emailOptIn=true`
4. **Send to verified users** - `emailVerified=true`
5. **Combined filters** - `giveawayId=1&emailOptIn=true&emailVerified=true`
6. **Template variables** - Verify {{firstName}}, {{lastName}}, {{hostCompanyName}}, {{subdomain}} replaced
7. **Security test** - Try to use another host's giveawayId (should fail 404)

### Verify Database
- Campaign record created with correct stats
- CampaignLog records created for each user
- filtersJson stored correctly

## Files Modified

1. `Campaign.java` - Added filtersJson field

## Estimated Time

- Database change: 5 min ✅ DONE
- Repositories: 10 min
- DTOs: 15 min
- Service: 60 min
- Controller: 30 min
- Testing: 30 min

**Total: ~2.5 hours**

## Future Enhancements

- Scheduled campaigns (use existing `scheduledAt` field)
- Draft campaigns (use existing `status` field)
- Campaign analytics dashboard
- A/B testing
- Email templates library
- Link tracking
- Open/click rate tracking (webhook integration)
- SMS support
- Push notifications

---

**Reference**: This plan integrates with existing user filtering from `UserAuthService.getUsersByHostId()` which supports:
- giveawayId, emailVerified, emailOptIn, smsOptIn filters
- Sorting by: lastLoginAt, createdAt, email, firstName, lastName