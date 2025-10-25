# OWNLY Sandbox Platform - Setup Guide

**Version**: 1.5.0 (with v1.6.0 models)
**Last Updated**: October 21, 2025

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - For version control

---

## Step 1: Clone/Navigate to Project

```bash
cd /Users/rejaulkarim/Documents/ownly
```

---

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

Required packages will be installed:
- express
- sequelize
- pg (PostgreSQL driver)
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- winston (logging)
- joi (validation)

### 2.2 Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ownly_sandbox;

# Create user (optional)
CREATE USER ownly_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ownly_sandbox TO ownly_user;

# Exit
\q
```

### 2.3 Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

**Minimum required configuration**:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ownly_sandbox
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 2.4 Set Up Database Tables

```bash
# Run database setup script
npm run setup:db

# Or manually:
node src/scripts/setupDatabase.js
```

This will create all 26 database tables with proper relationships.

### 2.5 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server should start at: **http://localhost:5000**

### 2.6 Test API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "OWNLY Sandbox API is running",
  "version": "1.5.0"
}
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

### 3.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

**Required configuration**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3.3 Start Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

Frontend should start at: **http://localhost:3000**

---

## Step 4: Create First User

### 4.1 Register via API

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ownly.com",
    "password": "Admin123!",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

### 4.2 Or via Frontend

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in registration form
4. Submit

---

## Step 5: Verify Installation

### 5.1 Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Should return version 1.5.0 or 1.6.0.

### 5.2 Database Check

```bash
# Connect to database
psql -U postgres -d ownly_sandbox

# List tables
\dt

# Should show 26 tables:
# - users, wallets, deals, spvs, investments
# - payouts, transactions, agents, assets
# - audit_logs, scenarios, secondary_market_listings
# - payout_schedules, notifications, documents
# - announcements, user_preferences, activity_logs
# - reports, payment_methods, webhooks
# - webhook_deliveries, email_templates, email_logs
# - workflows, workflow_executions
```

### 5.3 Test Authentication

```bash
# 1. Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","full_name":"Test User"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Save the token from response
TOKEN="<your-jwt-token>"

# 3. Get profile
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## Step 6: Optional Configuration

### 6.1 Enable Logging

Logs are automatically saved to:
- `backend/logs/error.log` - Error logs only
- `backend/logs/combined.log` - All logs

### 6.2 Rate Limiting (Production)

Already configured in .env:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 6.3 File Uploads

Create upload directory:
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

### 6.4 Stripe Integration (v1.6.0)

```bash
# Get your Stripe keys from https://dashboard.stripe.com/test/apikeys
# Add to .env:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 6.5 SendGrid Integration (v1.6.0)

```bash
# Get API key from https://app.sendgrid.com/settings/api_keys
# Add to .env:
SENDGRID_API_KEY=SG....
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

---

## Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd backend
npm install
```

**Error: "Database connection failed"**
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -U postgres -l`
- Check .env credentials

**Error: "JWT_SECRET is required"**
- Make sure .env file exists
- Set JWT_SECRET to a long random string

### Frontend won't start

**Error: "NEXT_PUBLIC_API_URL is not defined"**
- Create .env.local file
- Set NEXT_PUBLIC_API_URL=http://localhost:5000/api

**Error: "Port 3000 already in use"**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Issues

**"Permission denied" errors**
```bash
# Grant permissions
psql -U postgres -d ownly_sandbox
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

**Tables not created**
```bash
# Run setup again
npm run setup:db

# Or with force (WARNING: Deletes all data)
DB_FORCE=true npm run setup:db
```

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database (optional)
psql -U postgres -d ownly_sandbox
```

### Making Database Changes

1. Modify model in `backend/src/models/`
2. Run: `DB_ALTER=true npm run setup:db`
3. Verify changes: `psql -U postgres -d ownly_sandbox`

### Adding New Features

1. Create model (if needed)
2. Create controller
3. Create routes
4. Add to routes/index.js
5. Create frontend page
6. Update API client (lib/api.ts)

---

## Production Deployment

### Environment Variables

Update .env for production:
```env
NODE_ENV=production
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://yourdomain.com
```

### Database Migration

```bash
# Backup first!
pg_dump -U postgres ownly_sandbox > backup.sql

# Run migration
DB_ALTER=true npm run setup:db
```

### Build Frontend

```bash
cd frontend
npm run build
npm start
```

### Reverse Proxy (Nginx)

Example nginx config:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Next Steps

1. **Test Core Features**
   - Create a deal
   - Make an investment
   - Generate a payout
   - View reports

2. **Explore v1.5.0 Features**
   - User settings (/settings)
   - Activity logs (/activity)
   - Search (/search)
   - Reports (/reports)

3. **Set Up v1.6.0 (Optional)**
   - Configure Stripe
   - Configure SendGrid
   - Create webhooks
   - Build workflows

4. **Customize**
   - Modify email templates
   - Adjust deal types
   - Configure business rules

---

## Useful Commands

```bash
# Backend
npm run dev              # Start development server
npm start                # Start production server
npm run setup:db         # Setup database
npm run test             # Run tests (if configured)

# Frontend
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code

# Database
psql -U postgres -d ownly_sandbox              # Connect to DB
\dt                                             # List tables
\d users                                        # Describe table
SELECT * FROM users LIMIT 5;                   # Query data
```

---

## Support

For issues or questions:
- Check DESIGN_REVIEW.md for known issues
- Review error logs in `backend/logs/`
- Check browser console for frontend errors

---

**Platform Version**: 1.5.0
**Models**: 26
**Endpoints**: ~130
**Pages**: 22

**Status**: Ready for local development and testing!
