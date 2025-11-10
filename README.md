# Sweepgoat MVP - White-Label Giveaway Platform

A full-stack, multi-tenant SaaS platform that enables businesses to run branded giveaway campaigns with built-in CRM and marketing tools.

## 🎯 Project Overview

Sweepgoat is a comprehensive giveaway management platform built with a modern tech stack. It demonstrates proficiency in full-stack development, multi-tenant architecture, JWT authentication, and responsive UI design.

**Live Demo**: Contact for demo access

## 🏗️ Architecture

This is a **multi-tenant SaaS application** with three main components:

1. **sweepgoat-backend** - Spring Boot REST API
2. **sweepgoat-main** - Marketing/Host acquisition site (React)
3. **sweepgoat-tenant** - Subdomain tenant app for end-users and host dashboard (React)

### Multi-Tenant Design

- Each host gets their own branded subdomain (e.g., `acme.sweepgoat.com`)
- Subdomain-based tenant isolation with database-level separation
- White-label branding (custom logos and colors per tenant)
- JWT-based authentication with role-based access control (HOST vs USER)

## 🚀 Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.5.6**
- **PostgreSQL 16** for persistent storage
- **JWT** for stateless authentication
- **Spring Security** for authorization
- **JPA/Hibernate** for ORM
- **Maven** for dependency management
- **Cloudflare Images** for media storage

### Frontend
- **React 19** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **React Router v7** for client-side routing
- **Axios** for HTTP requests

## ✨ Key Features

### For Hosts (Business Owners)
- **White-Label Branding**: Customize logo and brand colors
- **Giveaway Management**: Create, manage, and track giveaways
- **Winner Selection**: Cryptographically secure random winner selection (SecureRandom)
- **CRM Dashboard**: View and manage registered users
- **Email Campaigns**: Send targeted emails to segmented user groups
- **Analytics**: Track entries, engagement, and campaign performance

### For Users (End Customers)
- **Email Verification**: Secure 6-digit code verification (24-hour expiry)
- **Free & Paid Entries**: One-time free entry + option for additional entries
- **Entry History**: View all entered giveaways and win status
- **Account Management**: Manage profile and view giveaway history

### Platform Features
- **Subdomain Routing**: Automatic tenant detection via subdomain
- **JWT Authentication**: Stateless, secure authentication
- **Role-Based Access**: Separate permissions for hosts and users
- **Responsive Design**: Mobile-first UI design
- **Real-time Updates**: Countdown timers and live status updates
- **Pagination**: Efficient data loading for large datasets

## 📁 Project Structure

```
sweepgoat/
├── sweepgoat-backend/          # Spring Boot API
│   ├── src/main/java/
│   │   └── com/sweepgoat/backend/
│   │       ├── controller/     # REST endpoints
│   │       ├── service/        # Business logic
│   │       ├── model/          # JPA entities
│   │       ├── repository/     # Data access layer
│   │       ├── dto/            # Data transfer objects
│   │       ├── security/       # JWT filters & config
│   │       └── exception/      # Custom exceptions
│   └── src/main/resources/
│       └── application.properties
│
├── sweepgoat-main/             # Main marketing site (React)
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API service layer
│   │   └── App.tsx
│   └── package.json
│
└── sweepgoat-tenant/           # Tenant subdomain app (React)
    ├── src/
    │   ├── pages/              # Public & dashboard pages
    │   ├── components/         # Reusable UI components
    │   ├── context/            # React context (auth, branding)
    │   ├── services/           # API service layer
    │   └── App.tsx
    └── package.json
```

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication with role-based access control
- **Password Hashing**: BCrypt for secure password storage
- **Email Verification**: 6-digit codes with 24-hour expiration
- **CORS Protection**: Configured for subdomain-based requests
- **Input Validation**: Bean validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries via JPA
- **Environment Variables**: Sensitive data stored in `.env` files (not committed)

## 📊 Database Schema

### Core Entities
- **Host**: Business/organization account
- **User**: End-user account (belongs to one host)
- **Giveaway**: Contest/giveaway created by host
- **GiveawayEntry**: User entries with point accumulation

### Key Relationships
- Host → Giveaway (one-to-many)
- Host → User (one-to-many)
- Giveaway → GiveawayEntry (one-to-many)
- User → GiveawayEntry (one-to-many)
- Unique constraint: One entry row per user+giveaway pair

## 🔌 API Endpoints

### Authentication (Public)
```
POST /api/auth/host/register         # Host registration
POST /api/auth/host/login            # Host login
POST /api/auth/user/register         # User registration
POST /api/auth/user/login            # User login
POST /api/auth/user/verify-email     # Email verification
POST /api/auth/user/resend-verification
```

### Public Endpoints
```
GET  /api/public/giveaways           # List active giveaways (paginated)
GET  /api/public/giveaways/{id}      # Get giveaway details
```

### User Endpoints (Requires USER auth)
```
GET    /api/user/my-entries          # View user's entries
GET    /api/user/my-giveaway-entries # User's giveaway history (paginated)
POST   /api/user/giveaways/{id}/enter  # Enter a giveaway
DELETE /api/user/account             # Delete user account
```

### Host Endpoints (Requires HOST auth)
```
GET    /api/host/giveaways                  # List all giveaways
GET    /api/host/giveaways/{id}             # Get giveaway details
GET    /api/host/giveaways/{id}/stats       # Giveaway statistics
GET    /api/host/giveaways/{id}/entries     # View leaderboard
POST   /api/host/giveaways                  # Create giveaway
POST   /api/host/giveaways/{id}/select-winner  # Select random winner
DELETE /api/host/giveaways/{id}             # Delete giveaway
GET    /api/host/users                      # View all users (paginated, sorted)
GET    /api/host/branding                   # Get branding settings
PATCH  /api/host/branding                   # Update branding
DELETE /api/host/account                    # Delete host account
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 16+
- Maven 3.9+

### Backend Setup

1. **Create PostgreSQL database:**
   ```bash
   createdb sweepgoat_dev -p 5433
   ```

2. **Configure environment variables:**
   ```bash
   cd sweepgoat-backend
   cp .env.example .env
   ```

   Update `.env` with your credentials:
   ```
   DB_URL=jdbc:postgresql://localhost:5433/sweepgoat_dev
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your-secret-key-min-32-characters-long
   ```

3. **Run the backend:**
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

   Backend runs on `http://localhost:8081`

### Frontend Setup (Main Site)

```bash
cd sweepgoat-main
npm install
npm run dev
```

Main site runs on `http://localhost:3000`

### Frontend Setup (Tenant App)

```bash
cd sweepgoat-tenant
npm install
npm run dev
```

Tenant app runs on `http://localhost:3001`

### Environment Configuration

Each frontend app needs a `.env` file:

```bash
# sweepgoat-main/.env
VITE_API_URL=http://localhost:8081

# sweepgoat-tenant/.env
VITE_API_URL=http://localhost:8081
```

## 📝 Development Notes

### Email Verification (Development Mode)
- Email verification codes are logged to the backend console
- Codes expire after 24 hours
- Production mode would use SendGrid or similar email service

### Subdomain Testing (Development)
- Main site: `http://localhost:3000`
- Tenant site: `http://localhost:3001`
- Production uses actual subdomains: `acme.sweepgoat.com`

### Auto-reload
- Backend: Spring Boot DevTools (port 35729)
- Frontend: Vite HMR (built-in)

## 🎨 Design System

- **Color Palette**: Dark mode with zinc grays
- **Typography**: System fonts with light/medium weights
- **Spacing**: Tailwind's 4px-based system
- **Components**: Reusable React components with props
- **Layout**: Responsive grid and flexbox layouts

## 🧪 Testing Considerations

### Manual Testing Checklist
- Host registration and email verification
- Host login and JWT persistence
- Subdomain routing and isolation
- Giveaway creation and management
- User registration and entry submission
- Winner selection (SecureRandom algorithm)
- CRM user filtering and sorting
- Email campaign sending
- Branding customization

### Future Testing
- Unit tests (JUnit, Mockito)
- Integration tests (Spring Boot Test)
- E2E tests (Playwright/Cypress)
- API tests (Postman/REST Assured)

## 🚧 Known Limitations (MVP)

- Email campaigns log to console (no actual sending yet)
- No payment integration for paid entries
- No custom domain support (only subdomains)
- No SMS campaigns (planned feature)
- No file upload for giveaway images (uses URLs only)

## 🔮 Future Enhancements

- [ ] Stripe integration for paid entries
- [ ] SendGrid/Mailgun integration for email campaigns
- [ ] SMS campaigns via Twilio
- [ ] Advanced analytics dashboard
- [ ] A/B testing for campaigns
- [ ] Social media integrations
- [ ] Automated winner notification emails
- [ ] Custom domain support
- [ ] Admin super-user role
- [ ] Audit logging
- [ ] Rate limiting

## 📖 Documentation

For detailed technical documentation, see:
- `sweepgoat-backend/Claude.md` - Backend architecture and API docs
- `sweepgoat-main/Claude.md` - Main site implementation guide
- `sweepgoat-tenant/Claude.md` - Tenant app implementation guide

## 👨‍💻 Developer

**Wilson Flores**
- GitHub: [@Wilsonf8](https://github.com/Wilsonf8)
- Portfolio: [Your portfolio URL]
- LinkedIn: [Your LinkedIn URL]

## 📄 License

This is an MVP portfolio project. All rights reserved.

---

**Built with** ☕ **and** ⚡ **by Wilson Flores**