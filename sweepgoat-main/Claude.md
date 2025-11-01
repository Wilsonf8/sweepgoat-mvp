# Sweepgoat Main Site - Claude Documentation

**Last Updated**: 2025-10-31
**Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4
**Port**: 3000
**URL**: `sweepgoat.com`

---

## Project Purpose

The main site (sweepgoat.com) is the marketing and host acquisition platform. Hosts register here, and after login they are redirected to their subdomain for dashboard access.

**Key Responsibilities:**
- Marketing landing page
- Host signup (create account + subdomain)
- Host login
- Redirect authenticated hosts to `{subdomain}.sweepgoat.com`

---

## Use Cases

### Marketing (Landing Page)

When visitors first arrive at `sweepgoat.com`, they see a comprehensive landing page with:

**Navigation Bar (Fixed at top):**
- Logo
- Section links (smooth scroll):
  - White Labeling
  - CRM/Marketing Campaign Management
  - Giveaway Setup
  - Get Started
  - Legal Compliance
- Call-to-action buttons:
  - Sign Up
  - Log In

**Page Sections (Top to Bottom):**

1. **White Labeling Section**
   - Explains custom branding capabilities
   - Show hosts can customize logo and colors
   - Emphasize professional, branded experience for their users

2. **CRM/Marketing Campaign Management Section**
   - Highlight user management features
   - Email campaign capabilities
   - User segmentation and targeting
   - Analytics and tracking

3. **Giveaway Setup Section**
   - Easy giveaway creation
   - Customizable entry mechanics
   - Date management
   - Prize configuration

4. **Get Started Section**
   - Clear call-to-action
   - Sign up button
   - Quick overview of onboarding process

5. **Legal Compliance Section**
   - Emphasize that platform helps run legal giveaways
   - Compliance features
   - Trust and credibility messaging
   - Legal disclaimers/terms

### Host Registration

**Required Fields:**
- Subdomain name (unique, validated)
- Company/Business name
- Email address
- Password

**Flow:**
1. User clicks "Sign Up" from landing page or nav
2. Redirected to `/signup` page
3. Fills out registration form with 4 required fields
4. Submits form → API validates subdomain availability
5. On success → Redirected to `/verify-email` page
6. Verify email page displays:
   - Message explaining a 6-digit code was sent to their email
   - Input field for the 6-digit verification code
   - "Verify" button
   - "Resend code" link (if code expires or not received)
7. After entering correct code → Redirected to success page
8. Success page displays:
   - Message: "Your giveaway platform is created!"
   - Link to their subdomain: `https://{subdomain}.sweepgoat.com`
   - Next steps/instructions

**Validation:**
- Subdomain must be unique (backend validation)
- Subdomain format rules (alphanumeric, lowercase, hyphens ok)
- Email format validation
- Password strength requirements
- Verification code is 6 digits
- Verification code expires after 24 hours

### Host Login

**Flow:**
1. User clicks "Log In" from landing page or nav
2. Redirected to `/login` page
3. Enters email + password
4. Submits form → API validates credentials
5. **If email is not verified:**
   - API returns special error response indicating email not verified
   - Frontend redirects to `/verify-email` page with email pre-filled
   - Host must verify email before proceeding
6. **If email is verified:**
   - API returns JWT + subdomain + business name
   - Save token, subdomain, and business name to localStorage
   - Redirect to success page
7. Success page displays:
   - Message: "Welcome back! Your giveaway platform is ready."
   - Link to their subdomain: `https://{subdomain}.sweepgoat.com`

**Note:** After login, hosts are shown the success page with their subdomain link. They must manually navigate to their subdomain to access the dashboard.

---

## Pages to Build

### 1. Landing Page (`/`)
**Purpose:** Marketing page to acquire new hosts

**Components:**
- Fixed navigation bar with:
  - Logo
  - Section navigation links (smooth scroll)
  - Sign Up button
  - Log In button
- Hero section
- White Labeling section (with id="white-labeling")
- CRM/Marketing Campaign Management section (with id="crm-marketing")
- Giveaway Setup section (with id="giveaway-setup")
- Get Started section (with id="get-started")
- Legal Compliance section (with id="legal-compliance")
- Footer

**Features:**
- Smooth scroll navigation when clicking nav links
- Responsive design (mobile, tablet, desktop)
- Call-to-action buttons throughout

### 2. Host Signup Page (`/signup`)
**Purpose:** Host registration form

**Form Fields:**
- Subdomain name (input with validation)
- Company/Business name (input)
- Email address (input with email validation)
- Password (input with strength indicator)
- Submit button

**Features:**
- Real-time subdomain availability check (optional)
- Form validation (client-side)
- Error messaging for validation failures
- Loading state during API call
- Redirect to success page on successful registration

### 3. Host Login Page (`/login`)
**Purpose:** Host authentication

**Form Fields:**
- Email address (input)
- Password (input)
- Submit button

**Features:**
- Form validation
- Error messaging for invalid credentials
- Loading state during API call
- Redirect to success page on successful login (if email verified)
- Redirect to verify-email page if email not verified
- Link to signup page ("Don't have an account?")

### 4. Email Verification Page (`/verify-email`)
**Purpose:** Email verification with 6-digit code

**Form Fields:**
- Email address (read-only, pre-filled from registration/login)
- 6-digit verification code (input)
- Verify button
- Resend code link

**Features:**
- Display message explaining code was sent to email
- Input validation (must be 6 digits)
- Error messaging for invalid/expired codes
- Loading state during API call
- Success message on verification
- Redirect to success page after successful verification
- Resend code functionality with cooldown timer (optional)
- Show code expiry time (24 hours from sent time)

**Notes:**
- This page is accessed after registration OR after login attempt with unverified email
- Email should be passed via URL params or localStorage
- After successful verification, user proceeds to success page

### 5. Success Page (`/success`)
**Purpose:** Post-login/registration confirmation

**Content:**
- Success message:
  - After registration: "Your giveaway platform is created!"
  - After login: "Welcome back! Your giveaway platform is ready."
- Subdomain link display:
  - Format: `https://{subdomain}.sweepgoat.com`
  - Clickable link
- Next steps/instructions
- Optional: Quick start guide

**Features:**
- Dynamically show subdomain from localStorage
- Celebratory/welcoming design

---

## API Endpoints Used

### Host Registration
```
POST /api/auth/host/register

Request Body:
{
  "companyName": "Acme Inc",
  "subdomain": "acme",
  "email": "host@acme.com",
  "password": "securePassword123"
}

Response (200 OK):
{
  "message": "Registration successful! Check your email for a 6-digit verification code."
}

Error Response (409 Conflict):
{
  "error": "Subdomain already exists"
}
```

### Host Login
```
POST /api/auth/host/login

Request Body:
{
  "email": "host@acme.com",
  "password": "securePassword123"
}

Response (200 OK - Email Verified):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "HOST",
  "id": 1,
  "email": "host@acme.com",
  "subdomain": "acme",
  "companyName": "Acme Inc"
}

Response (403 Forbidden - Email Not Verified):
{
  "error": "Please verify your email to continue",
  "email": "host@acme.com",
  "emailVerified": false
}

Error Response (401 Unauthorized):
{
  "error": "Invalid credentials"
}
```

### Verify Host Email
```
POST /api/auth/host/verify-email

Request Body:
{
  "email": "host@acme.com",
  "code": "123456"
}

Response (200 OK):
{
  "message": "Email verified successfully! You can now log in."
}

Error Response (400 Bad Request):
{
  "error": "Invalid verification code"
}

Error Response (400 Bad Request - Expired):
{
  "error": "Verification code has expired. Please request a new one."
}
```

### Resend Host Verification Code
```
POST /api/auth/host/resend-verification

Request Body:
{
  "email": "host@acme.com"
}

Response (200 OK):
{
  "message": "Verification code sent! Check your email."
}

Error Response (404 Not Found):
{
  "error": "Host not found"
}
```

---

## Routing Strategy

**All routes are public (no authentication required on main site):**

- `/` - Landing page (public)
- `/signup` - Host registration (public)
- `/login` - Host login (public)
- `/verify-email` - Email verification page (public)
- `/success` - Post-login/registration success page (public, but shows personalized data from localStorage)

**Navigation:**
- Use React Router for client-side routing
- Smooth scroll for landing page section navigation
- Programmatic navigation after form submissions

---

## Authentication Flow

### Registration Flow
1. User visits `/` (landing page)
2. Clicks "Sign Up" button
3. Redirected to `/signup` page
4. Fills out form:
   - Subdomain name
   - Company name
   - Email
   - Password
5. Clicks "Submit"
6. Frontend validates form (client-side)
7. POST request to `/api/auth/host/register`
8. Backend validates subdomain availability
9. Backend creates host account and generates 6-digit verification code
10. Backend sends verification email (logs to console in MVP)
11. Backend returns:
    - Success message
12. Frontend saves to localStorage:
    - `pendingEmail` = email (for verify-email page)
13. Frontend redirects to `/verify-email`
14. Verify email page shows:
    - Email (read-only)
    - Code input field
    - Verify button
    - Resend code link
15. User enters 6-digit code from email (console)
16. POST request to `/api/auth/host/verify-email`
17. Backend validates code and marks email as verified
18. Frontend redirects to `/login` page with success message
19. User logs in with verified email

### Login Flow
1. User visits `/` (landing page)
2. Clicks "Log In" button
3. Redirected to `/login` page
4. Fills out form:
   - Email
   - Password
5. Clicks "Submit"
6. Frontend validates form (client-side)
7. POST request to `/api/auth/host/login`
8. Backend validates credentials
9. **If email not verified:**
   - Backend returns 403 error with emailVerified: false
   - Frontend saves `pendingEmail` to localStorage
   - Frontend redirects to `/verify-email`
   - User must verify email before proceeding
10. **If email is verified:**
    - Backend returns JWT token, subdomain, and business name
    - Frontend saves to localStorage:
      - `hostToken` = JWT
      - `subdomain` = subdomain
      - `companyName` = business name
    - Frontend redirects to `/success`
    - Success page displays welcome back message with subdomain link

### Accessing Dashboard
- User must manually click the subdomain link on success page
- Link navigates to: `https://{subdomain}.sweepgoat.com`
- Subdomain app will handle host authentication and dashboard display

---

## Environment Variables

```
VITE_API_URL=http://localhost:8081  # Backend API URL
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

# Run dev server (port 3000)
npm run dev

# Build for production
npm run build
```

---

## Notes

### Design Considerations
- Use clean, modern, professional design
- Emphasize trust and credibility (legal compliance messaging)
- Mobile-responsive throughout
- Fast loading times (optimize images)
- Accessible (WCAG compliance)

### Key Features Summary
1. **Landing Page**: Multi-section marketing page with smooth scroll navigation
2. **Signup**: Simple 4-field form with subdomain validation
3. **Login**: Standard email/password authentication
4. **Success Page**: Celebratory post-auth page with subdomain link

### Important Notes
- Main site has **NO dashboard** - it's purely for acquisition
- Hosts are **not automatically redirected** to subdomain after login
- They see a success page with a **link** they must click
- All host dashboard functionality lives on the subdomain (tenant app)
- Keep forms simple and conversion-optimized