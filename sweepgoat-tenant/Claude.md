# Sweepgoat Tenant Subdomain App - Claude Documentation

**Last Updated**: 2025-10-31
**Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4
**Port**: 3001
**URL**: `*.sweepgoat.com` (e.g., `acme.sweepgoat.com`)

---

## Project Purpose

The tenant subdomain app serves **two audiences**:

1. **End Users** - Browse giveaways, create accounts, enter giveaways (public + user-authenticated)
2. **Host Dashboard** - Host logs in to manage their giveaways, users, and campaigns (host-authenticated)

**Architecture:**
- Subdomain is automatically detected from URL
- All API requests include `X-Subdomain` header
- Different routes/UI for public users vs. host dashboard

---

## Public Use Cases (End Users)

When users visit the subdomain (logged in or not), they see a public-facing site with a **top navbar** (not sidebar).

### Public Home Page

**Purpose:** Display the current active giveaway

**Current Giveaway Section:**
- Giveaway image (hero/featured)
- Giveaway title
- Countdown timer to end date (real-time)
- "Enter Now" button:
  - If user is NOT logged in → redirects to `/login`
  - If user is logged in but NOT entered → enters the giveaway
  - If user is already entered → button shows "You are entered!" (disabled/different style)
- Empty state if no active giveaway:
  - "No active giveaway at the moment. Check back soon!"

### Top Navbar

**Navigation items:**
1. **Logo/Brand** (left side) → links to `/`
2. **Previous Giveaways** → `/previous-giveaways`
3. **Account** (if logged in) → `/account`
4. **Settings** → `/settings`
5. **Login** (if NOT logged in) → `/login`
6. **Logout** (if logged in) → logs out, redirects to `/`

---

### Previous Giveaways Page

**Purpose:** Browse all past giveaways

**Features:**
- Display all ended/cancelled giveaways
- **5 giveaways per page** (pagination)
- Each giveaway shows:
  - Title
  - Image (thumbnail)
  - End date
  - Winner name (if applicable)
  - Status badge (ENDED, CANCELLED)
- Pagination controls (Previous/Next, page numbers)

**Backend TODO:** Add pagination support to giveaway endpoints (not yet implemented)

---

### Account Page

**Purpose:** User profile and giveaway history (requires login)

**Content:**
- **Profile Information:**
  - Name (first + last)
  - Email
  - Phone number
- **Giveaway History:**
  - Section title: "My Giveaway Entries"
  - List format (simple, no images):
    - Giveaway name
    - End date/time
    - Status: "Won" (highlighted/badge) or "Lost" or "Active"
  - Shows both current and previous giveaways entered
  - Sort by most recent first

---

### Settings Page

**Purpose:** User account settings

**Content:**
- **Change Password:**
  - Current password (input)
  - New password (input)
  - Confirm new password (input)
  - "Update Password" button

**Backend TODO:** Implement password change endpoints for both users and hosts (not yet implemented)

**Future settings:**
- Email notification preferences
- Delete account

---

## Host Dashboard Use Cases

When a host logs into their subdomain, they are taken to a dashboard with a **sidebar navigation** (top navbar is removed for host dashboard).

### Dashboard Page (Home)

**Purpose:** Overview of current giveaway performance

**Current Giveaway Stats Display:**
- Giveaway name/title
- Total people entered in current giveaway
- Countdown timer to giveaway end date
- Empty state if no active giveaway

**Constraint:** Hosts can run **maximum 1 active giveaway at a time**

### Sidebar Navigation

The sidebar contains the following menu items:
1. **Dashboard** - Home/overview page
2. **Giveaways** - Manage past and current giveaways
3. **CRM** - User management and selection
4. **Campaigns** - View email/SMS campaign history and stats
5. **Settings** - Branding customization

---

### Giveaways Section

**Features:**
- View all giveaways (past and current)
- Each giveaway shows:
  - Title
  - Start time
  - End time
  - Winner (for ended giveaways)
  - Status (ACTIVE, ENDED, CANCELLED)
- Create new giveaway button

**Create Giveaway Form:**
Required fields:
- Title
- Description
- Image (upload/URL)
- Start date/time
- End date/time

---

### CRM Section

**Purpose:** Manage all users registered to this host's subdomain

**User List Features:**
- Sortable columns (click header to sort):
  - Email
  - First name
  - Last name
  - Created at (registration date)
  - Last login at (show timestamp)
  - Email verified status
- Filter options (above table)
- Pagination controls

**User Selection:**
- Checkbox next to each user for individual selection
- "Select All" button - selects all users in current filter/sort view
- "Deselect All" button - deselects all users
- Selected count indicator (e.g., "15 users selected")

**Launch Campaign Button:**
- Visible when users are selected
- Opens email composer modal
- Allows sending email to selected users
- Supports user name variables (e.g., {{firstName}}, {{lastName}})
- SMS not implemented yet (future feature)

---

### Campaigns Section

**Purpose:** View history and analytics of all launched campaigns

**Campaign List:**
- Shows all campaigns launched (most recent first)
- Each campaign row displays:
  - Campaign name/subject
  - Type: Email, SMS, or Both (badge/icon)
  - Launched date/time
  - Number of recipients
  - Click to view details

**Campaign Detail View (click on a campaign):**
When clicking a campaign, show:
- Campaign name/subject
- Full message content
- Number of users targeted
- Filter/sort parameters used when selecting users
- Type (Email, SMS, or Both)
- Launch timestamp
- Analytics:
  - Emails sent count
  - Emails opened/read (if tracking available)
  - SMS sent count (future)
  - SMS delivered count (future)
  - Click-through rate (future)

---

### Settings Section

**Purpose:** Customize subdomain branding

**Branding Options:**
- **Primary Color:**
  - Color picker to select hex color
  - Preview of color on buttons/links
  - Default: #FFFF00 (yellow)
- **Logo:**
  - Upload image or provide URL
  - Recommended size/format guidance
  - Preview of logo
  - Remove logo option

**Save Changes Button:**
- Updates branding via API
- Shows success/error messages

---

## Pages to Build

### Public Pages (End Users)

**Layout:** All public pages use top navbar (no sidebar)

#### 1. `/`
**Purpose:** Public home page - current giveaway display

**Layout:** Navbar + hero section

**Content:**
- Current giveaway display:
  - Large hero image
  - Giveaway title (prominent)
  - Countdown timer (real-time updates)
  - "Enter Now" button:
    - State 1: User not logged in → redirects to `/login`
    - State 2: User logged in, not entered → submits entry, updates to "You are entered!"
    - State 3: User already entered → shows "You are entered!" (disabled, success style)
- Empty state (no active giveaway):
  - Message: "No active giveaway at the moment. Check back soon!"
  - CTA: "View Previous Giveaways" → `/previous-giveaways`

---

#### 2. `/previous-giveaways`
**Purpose:** Browse all past giveaways

**Layout:** Navbar + grid/list view

**Content:**
- Page title: "Previous Giveaways"
- Grid or list of past giveaways:
  - Giveaway card:
    - Image (thumbnail)
    - Title
    - End date
    - Winner name (if selected)
    - Status badge (ENDED, CANCELLED)
- **Pagination:**
  - 5 giveaways per page
  - Previous/Next buttons
  - Page numbers
- Empty state (no previous giveaways):
  - "No previous giveaways yet!"

**Backend TODO:** Implement pagination for giveaways (5 per page)

---

#### 3. `/account`
**Purpose:** User profile and giveaway entry history (requires login)

**Layout:** Navbar + profile view

**Auth Required:** Redirects to `/login` if not authenticated

**Content:**
- Page title: "My Account"
- **Profile Section:**
  - First Name
  - Last Name
  - Email
  - Phone Number
- **Giveaway History Section:**
  - Section title: "My Giveaway Entries"
  - Simple list (no images):
    - Each entry shows:
      - Giveaway name
      - End date/time
      - Status badge:
        - "WON" (highlighted in gold/green)
        - "ACTIVE" (current giveaway)
        - "ENDED" (didn't win)
  - Sort: Most recent first
  - Shows both current and past entries

---

#### 4. `/settings`
**Purpose:** User account settings

**Layout:** Navbar + settings form

**Content:**
- Page title: "Settings"
- **Change Password Section:**
  - Current password (input, type=password)
  - New password (input, type=password)
  - Confirm new password (input, type=password)
  - Validation: New passwords must match
  - "Update Password" button
  - Success/error messages

**Backend TODO:** Implement password change for users and hosts

**Future sections:**
- Email notifications toggle
- Delete account button

---

#### 5. `/login`
**Purpose:** User authentication

**Layout:** Centered form (minimal navbar or no navbar)

**Form Fields:**
- Email (input)
- Password (input)
- "Log In" button
- "Don't have an account? Sign Up" link → `/signup`

**Flow:**
- If email not verified → redirect to `/verify-email`
- If credentials valid and verified → save JWT, redirect to `/`

---

#### 6. `/signup`
**Purpose:** User registration

**Layout:** Centered form (minimal navbar or no navbar)

**Form Fields:**
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Phone Number (required)
- Password (required, strength indicator)
- Confirm Password (required, must match)
- "Sign Up" button
- "Already have an account? Log In" link → `/login`

**Flow:**
- Submit → backend creates user and sends verification email
- Redirect to `/verify-email` with email pre-filled
- User must verify before logging in

---

#### 7. `/verify-email`
**Purpose:** Email verification with 6-digit code

**Layout:** Centered form

**Form Fields:**
- Email (read-only, pre-filled)
- 6-digit code (input)
- "Verify" button
- "Resend Code" link

**Flow:**
- User receives 6-digit code via email (console logged in MVP)
- Enter code → backend validates
- Success → redirect to `/login` with success message
- Can resend code if expired (24 hour expiry)

### Host Dashboard Pages

**Layout:** All host dashboard pages use sidebar navigation (no top navbar)

#### 1. `/host/login`
**Purpose:** Host authentication page

**Features:**
- Email/password login form
- Error handling for invalid credentials
- Redirect to `/host/dashboard` on success
- Email verification check (redirect to verify-email if needed)

---

#### 2. `/host/dashboard`
**Purpose:** Dashboard home/overview

**Layout:** Sidebar + main content area

**Content:**
- Page title: "Dashboard"
- Current giveaway card (if exists):
  - Giveaway title
  - Total entries count
  - Countdown timer to end date (real-time)
  - "View Details" button → `/host/giveaways/:id`
- Empty state (if no active giveaway):
  - "No active giveaway"
  - "Create Giveaway" button → `/host/giveaways/new`

---

#### 3. `/host/giveaways`
**Purpose:** Giveaway management list

**Layout:** Sidebar + main content area

**Content:**
- Page title: "Giveaways"
- "Create New Giveaway" button (top right) → `/host/giveaways/new`
- Tabs or filter:
  - All
  - Active
  - Ended
  - Cancelled
- Giveaway table/cards:
  - Title
  - Status badge (ACTIVE, ENDED, CANCELLED)
  - Start date
  - End date
  - Winner name (if ended and winner selected)
  - Total entries count
  - Actions: View Details, Delete (with confirmation)
- Click row → `/host/giveaways/:id`

---

#### 4. `/host/giveaways/new`
**Purpose:** Create new giveaway

**Layout:** Sidebar + form

**Form Fields:**
- Title (text input, required)
- Description (textarea, required)
- Image:
  - Option 1: Upload file
  - Option 2: Enter image URL
  - Image preview
- Start date/time (datetime picker, required)
- End date/time (datetime picker, required)
- Validation: End date must be after start date
- Submit button: "Create Giveaway"
- Cancel button → `/host/giveaways`

**Validation:**
- Check if host already has an active giveaway (max 1)
- If yes, show error: "You can only run 1 active giveaway at a time. End current giveaway first."

---

#### 5. `/host/giveaways/:id`
**Purpose:** Giveaway details and stats

**Layout:** Sidebar + details view

**Content:**
- Giveaway title
- Status badge
- Image
- Description
- Start/end dates
- Statistics card:
  - Total entries
  - Unique users entered
  - Top entrant (most entries)
- Leaderboard:
  - User name
  - Email
  - Total entries
  - Sortable by entries
- Actions:
  - Delete giveaway (with confirmation)
  - Select winner (if ended and no winner yet)
  - View winner (if ended with winner)

---

#### 6. `/host/crm`
**Purpose:** User management and selection for campaigns

**Layout:** Sidebar + table view

**Content:**
- Page title: "CRM - User Management"
- Filter section (collapsible):
  - Email verified: All / Verified / Unverified
  - Registration date range picker
  - Last login date range picker
  - Apply Filters / Clear Filters buttons
- Bulk actions bar (visible when users selected):
  - "X users selected"
  - "Select All" button (selects all in current page/filter)
  - "Deselect All" button
  - "Launch Campaign" button → opens email composer modal
- User table:
  - Columns:
    - Checkbox (select)
    - Email (sortable)
    - First Name (sortable)
    - Last Name (sortable)
    - Email Verified (badge/icon, sortable)
    - Created At (sortable)
    - Last Login At (sortable, show "Never" if null)
  - Pagination controls (bottom)
  - Page size selector (10, 25, 50, 100)

**Email Composer Modal:**
- Modal title: "Launch Campaign"
- Form:
  - Campaign name/subject (required)
  - Message type: Email (SMS disabled/grayed out)
  - Message body (rich text editor)
  - Variable insertion buttons:
    - {{firstName}}
    - {{lastName}}
    - {{email}}
  - Preview section (shows sample with variables replaced)
  - Recipient count display: "Sending to X users"
- Actions:
  - "Send Campaign" button
  - "Cancel" button
- Success: Close modal, show success toast, redirect to `/host/campaigns`

---

#### 7. `/host/campaigns`
**Purpose:** Campaign history and analytics

**Layout:** Sidebar + list view

**Content:**
- Page title: "Campaigns"
- Campaign list (most recent first):
  - Campaign card/row:
    - Subject/name
    - Type badge (Email / SMS / Both)
    - Sent date/time (relative, e.g., "2 hours ago")
    - Recipients count
    - Stats preview: "45% opened" (if available)
    - Click anywhere → `/host/campaigns/:id`

---

#### 8. `/host/campaigns/:id`
**Purpose:** Campaign detail and analytics

**Layout:** Sidebar + detail view

**Content:**
- Campaign subject/name
- Type badge (Email / SMS / Both)
- Sent timestamp (full date/time)
- Message content (formatted)
- Target audience section:
  - Number of recipients
  - Filter/sort parameters used (display as chips/tags)
- Analytics section:
  - **Email metrics** (if email campaign):
    - Sent: X
    - Delivered: X (if tracking available)
    - Opened: X (Y%)
    - Clicked: X (Y%) - future
  - **SMS metrics** (if SMS campaign - future):
    - Sent: X
    - Delivered: X
    - Failed: X
- Back button → `/host/campaigns`

---

#### 9. `/host/settings`
**Purpose:** Branding customization

**Layout:** Sidebar + settings form

**Content:**
- Page title: "Settings"
- Branding section:
  - **Logo:**
    - Current logo preview (or placeholder if none)
    - Upload button (file picker)
    - OR URL input field
    - Remove logo button (if logo exists)
    - Recommended: "500x500px, PNG or JPG, max 2MB"
  - **Primary Color:**
    - Color picker (hex input + visual picker)
    - Current color preview
    - Default color reference: "#FFFF00 (yellow)"
    - Live preview of buttons/links with selected color
  - Save Changes button
  - Reset to Defaults button

**Other settings (future):**
- Account email/password
- Notification preferences
- Billing/subscription (future)

---

## API Endpoints Used

*[TO BE FILLED BY USER]*

### Public Endpoints
```
GET  /api/public/giveaways          # List active giveaways
GET  /api/public/giveaways/:id      # Giveaway details
```

### User Auth Endpoints
```
POST /api/auth/user/register        # User signup
POST /api/auth/user/login           # User login
POST /api/auth/user/verify-email    # Email verification
POST /api/auth/user/resend-verification
```

### User Endpoints (Authenticated)
```
GET  /api/user/my-entries                    # User's current entries (legacy)
GET  /api/user/my-giveaway-entries?page=0&size=5  # User's giveaway history with pagination (NEW - TODO)
POST /api/user/giveaways/:id/enter           # Enter giveaway
POST /api/user/change-password               # Change password (TODO)
DELETE /api/user/account                     # Delete account
```

### Host Auth Endpoints
```
POST /api/auth/host/login           # Host login
```

### Host Endpoints (Authenticated)
```
# Giveaways
GET    /api/host/giveaways
GET    /api/host/giveaways/active
GET    /api/host/giveaways/:id
POST   /api/host/giveaways
DELETE /api/host/giveaways/:id
GET    /api/host/giveaways/:id/stats
GET    /api/host/giveaways/:id/entries

# Users/CRM
GET    /api/host/users?page=0&size=50&sortBy=lastLoginAt&sortOrder=desc

# Campaigns
POST   /api/host/campaigns/send

# Branding
GET    /api/host/branding
PATCH  /api/host/branding

# Account
POST   /api/host/change-password        # Change password (TODO)
DELETE /api/host/account
```

---

## Routing Strategy

### Route Organization

**Option A: Path-based separation**
```
/                    → Public home
/giveaway/:id        → Public giveaway detail
/signup              → User signup
/login               → User login
/my-entries          → User entries (auth)

/host/login          → Host login
/host/dashboard      → Host dashboard (auth)
/host/giveaways      → Host giveaway list (auth)
```

**Option B: Separate subdomains** *(not applicable - single subdomain per tenant)*

*[TO BE FILLED BY USER]*
Choose routing strategy and define all routes.

---

## Subdomain Detection

The app automatically detects the subdomain from the URL:

```typescript
// Development
http://acme.localhost:3001    → subdomain = "acme"

// Production
https://acme.sweepgoat.com    → subdomain = "acme"
```

This subdomain is sent as the `X-Subdomain` header on all API requests.

**Implementation:**
- Utility function extracts subdomain from `window.location.hostname`
- Axios interceptor automatically adds header to all requests

---

## Authentication Flows

### User Authentication Flow
*[TO BE FILLED BY USER]*

Example:
1. User visits `/signup`
2. Submits registration form
3. Backend sends 6-digit verification code via email
4. User enters code on `/verify-email`
5. Code verified → user can login
6. Login → save JWT to localStorage
7. Access protected routes

### Host Authentication Flow
*[TO BE FILLED BY USER]*

Example:
1. Host visits `/host/login` on their subdomain
2. Enters email/password
3. Backend returns JWT
4. Save token to localStorage
5. Redirect to `/host/dashboard`
6. Access host-only routes

---

## Dynamic Branding

*[TO BE FILLED BY USER]*

Example:
- On app load, fetch host's branding (logo + primaryColor) from API
- Apply primaryColor as CSS variable
- Display logo in header
- Style buttons/links with brand color

---

## Environment Variables

```
VITE_API_URL=http://localhost:8081  # Backend API URL
VITE_DEV_SUBDOMAIN=demo             # Fallback subdomain for localhost testing
```

---

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## Development

```bash
# Install dependencies
npm install

# Run dev server (port 3001)
npm run dev

# Access via subdomain
http://acme.localhost:3001

# Build for production
npm run build
```

---

## Backend TODOs

The following features need to be implemented in the backend before the frontend can fully implement all pages:

### 1. **User Giveaway Entries with Pagination** (Priority: HIGH)
- Endpoint to list all giveaways a user has entered (current and past)
- Required for: `/account` page (Giveaway History section)
- Spec:
  - Return giveaway details for each entry (title, end date, winner info)
  - Include entry status: "WON", "ACTIVE", or "ENDED"
  - Sort by most recent first (by giveaway end date desc)
  - Pagination: 5 entries per page
- Endpoint needed:
  - `GET /api/user/my-giveaway-entries?page={page}&size=5`
  - Response should include:
    - Giveaway ID
    - Giveaway title
    - Giveaway end date/time
    - Status: "ACTIVE" (ongoing), "WON" (user won), "ENDED" (user didn't win)
    - Winner ID (to determine if user won)
    - Pagination metadata (totalPages, totalItems, etc.)

### 2. **Public Giveaway Pagination** (Priority: Medium)
- Add pagination support for public giveaway endpoints (previous giveaways)
- Required for: `/previous-giveaways` page
- Spec: 5 giveaways per page
- Endpoint: `GET /api/public/giveaways?page={page}&size=5&status=ENDED`

### 3. **Password Change** (Priority: High)
- Implement password change for **users**
- Implement password change for **hosts**
- Required for: `/settings` and `/host/settings` pages
- Endpoints needed:
  - `POST /api/user/change-password` (requires current password + new password)
  - `POST /api/host/change-password` (requires current password + new password)

---

## Notes

### Key Considerations:
- Handle "no active giveaways" state (show placeholder)
- Email verification flow for users
- Separate UI/UX for public vs. host dashboard
- Responsive design for mobile users
- Loading states for API calls
- Error handling
- Countdown timers should update in real-time
- "You are entered!" button state should be persisted/synced
- Logout should clear localStorage and redirect appropriately
- Protected routes should check auth and redirect to login if needed