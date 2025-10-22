# Sweepgoat Backend

Multi-tenant giveaway platform backend built with Spring Boot.

## Prerequisites

- Java 21
- PostgreSQL 16+
- Maven (included via wrapper)

## Setup

### 1. Database Setup

```bash
# Start PostgreSQL (if using Homebrew on macOS)
brew services start postgresql@16

# Create database
createdb sweepgoat_db
```

### 2. Environment Configuration

**For IntelliJ IDEA (Recommended):**
```bash
# Copy the dev profile template
cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties

# Edit with your local settings
nano src/main/resources/application-dev.properties
```

**For Command Line / Other IDEs:**
```bash
# Copy the example .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required configuration:
- `DB_URL` - PostgreSQL connection URL
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password (can be empty for local dev)
- `SERVER_PORT` - Application port (default: 8081)
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `JWT_EXPIRATION` - Token expiration in milliseconds (default: 86400000 = 24 hours)

### 3. Run the Application

**Option 1: IntelliJ IDEA (Easiest)**
1. The run configuration is already set to use the `dev` profile
2. Just click the Run button on `SweepgoatBackendApplication.java`
3. (The `application-dev.properties` file will be loaded automatically)

**Option 2: Using the run script (Command Line)**
```bash
./run-local.sh
```

**Option 3: Export variables manually**
```bash
export $(cat .env | grep -v '^#' | xargs)
./mvnw spring-boot:run
```

**Option 4: Using Maven with dev profile**
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## Project Structure

```
src/main/java/com/sweepgoat/backend/
├── config/          # Security and application configuration
├── model/           # JPA entities (Host, User, Giveaway, etc.)
├── repository/      # Spring Data JPA repositories
├── security/        # JWT authentication filter
└── util/            # Utility classes (JWT, Subdomain extraction)
```

## API Endpoints

The application runs on `http://localhost:8081` (or your configured port)

### Public Endpoints
- `POST /api/auth/login` - User/Host login
- `POST /api/auth/register` - User registration

### Protected Endpoints
*(Require JWT token in Authorization header)*
- `GET /api/giveaways` - List giveaways
- `POST /api/giveaways` - Create giveaway (Host only)
- More endpoints coming soon...

## Testing with Postman

1. Start the application
2. Use header `X-Subdomain: localhost` for local testing
3. Include `Authorization: Bearer <token>` for protected endpoints

## Multi-Tenancy

This application uses subdomain-based multi-tenancy:
- Production: `host1.sweepgoat.com`, `host2.sweepgoat.com`
- Local dev: Use `X-Subdomain` header to specify the host

## Development

```bash
# Compile only
./mvnw compile

# Run tests
./mvnw test

# Package application
./mvnw package
```

## Security Notes

⚠️ **IMPORTANT**: Never commit sensitive files to version control!

- `.env` is in `.gitignore`
- `application-dev.properties` is in `.gitignore`
- `application.properties` contains NO sensitive data (only placeholders)
- Use strong JWT secrets in production (min 32 characters)
- Change default passwords before deploying

## License

Proprietary