# OWNLY Sandbox Platform

**Version**: 1.5.0 (with v1.6.0 models ready)
**Status**: Development - Ready for Testing

---

## Overview

The OWNLY Sandbox Platform is a comprehensive investment management system for Special Purpose Vehicles (SPVs), built with modern web technologies.

### Features

✅ **v1.0.0 - Core Platform**
- User authentication & authorization
- Deal management
- Investment processing
- SPV creation
- Transaction tracking

✅ **v1.1.0 - Analytics Engine**
- Scenario modeling
- Waterfall analysis
- Performance projections

✅ **v1.2.0 - Payout System**
- Automated payout distribution
- Waterfall calculations
- Investor distributions

✅ **v1.3.0 - Operations**
- Asset management
- Operations tracking
- Financial reporting

✅ **v1.4.0 - Platform Expansion**
- KYC/AML verification
- Secondary market
- Payout scheduling
- Agent system
- Notifications
- Document management
- Announcements

✅ **v1.5.0 - User Experience**
- User settings & preferences
- Activity logs & audit trail
- Advanced search & filtering
- Report generation

🔨 **v1.6.0 - Integration & Automation** (Models Ready)
- Payment integration (Stripe)
- Webhook system
- Email templates
- Workflow automation

---

## Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Winston Logging
- Joi Validation

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

**Integrations (v1.6.0):**
- Stripe (Payments)
- SendGrid (Email)
- Webhooks
- Workflows

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run setup:db
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## Documentation

📖 **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions

📋 **[DESIGN_REVIEW.md](DESIGN_REVIEW.md)** - Architecture and design review

🗺️ **[ROADMAP.md](ROADMAP.md)** - Future development plans

📦 **Version Summaries:**
- [V1.5.0_SUMMARY.md](V1.5.0_SUMMARY.md) - User Experience features
- [V1.6.0_SUMMARY.md](V1.6.0_SUMMARY.md) - Integration features (in progress)
- [PLATFORM_SUMMARY.md](PLATFORM_SUMMARY.md) - Complete platform overview

📝 **[RELEASE_NOTES_v1.5.0.md](RELEASE_NOTES_v1.5.0.md)** - Latest release notes

---

## Project Structure

```
ownly/
├── backend/
│   ├── src/
│   │   ├── models/           # 26 database models
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── config/           # Configuration files
│   │   ├── scripts/          # Utility scripts
│   │   └── utils/            # Helper functions
│   ├── logs/                 # Application logs
│   ├── uploads/              # File uploads
│   └── package.json
│
├── frontend/
│   ├── app/                  # Next.js 14 pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities & API client
│   └── package.json
│
└── docs/                     # Documentation
```

---

## Database Models (26 Total)

### Core (v1.0.0)
- User, Wallet, Deal, SPV, Investment, Payout, Transaction

### Features (v1.1.0 - v1.4.0)
- Agent, Asset, AuditLog, Scenario
- SecondaryMarketListing, PayoutSchedule
- Notification, Document, Announcement

### User Experience (v1.5.0)
- UserPreference, ActivityLog, Report

### Integration (v1.6.0)
- PaymentMethod, Webhook, WebhookDelivery
- EmailTemplate, EmailLog
- Workflow, WorkflowExecution

---

## API Endpoints (~130 Total)

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/profile
PATCH  /api/auth/profile
```

### Deals
```
GET    /api/deals
POST   /api/deals
GET    /api/deals/:id
PATCH  /api/deals/:id
POST   /api/deals/:id/publish
```

### Investments
```
POST   /api/investments
GET    /api/investments/my-investments
GET    /api/investments/:id
```

### Search (v1.5.0)
```
GET    /api/search
GET    /api/search/deals
GET    /api/search/investments
```

### Reports (v1.5.0)
```
GET    /api/reports
POST   /api/reports/generate
GET    /api/reports/:id/download
```

**See documentation for complete API reference**

---

## Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Database Migrations

```bash
cd backend

# Setup database (first time)
npm run setup:db

# Update existing database
DB_ALTER=true npm run setup:db
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

---

## Configuration

### Environment Variables

**Backend (.env):**
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe API key (v1.6.0)
- `SENDGRID_API_KEY` - SendGrid API key (v1.6.0)

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

See `.env.example` files for complete configuration options.

---

## Security

- JWT authentication on all protected routes
- Role-based authorization (investor, admin, agent)
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- Helmet security headers
- CORS configuration

---

## Performance

- Database indexing on key fields
- Connection pooling
- Compression middleware
- Optimized queries with Sequelize
- Pagination on list endpoints

---

## Support & Contribution

For issues, questions, or contributions:
1. Check DESIGN_REVIEW.md for known issues
2. Review SETUP_GUIDE.md for setup help
3. See ROADMAP.md for planned features

---

## License

PROPRIETARY - OWNLY Platform

---

## Statistics

- **Models**: 26
- **API Endpoints**: ~130
- **Frontend Pages**: 22
- **Lines of Code**: ~50,000+
- **Development Time**: October 2025

---

**Built with ❤️ by the OWNLY Team**

**Last Updated**: October 21, 2025
