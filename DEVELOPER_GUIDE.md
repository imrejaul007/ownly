# OWNLY Platform - Complete Developer Guide

**Last Updated**: November 14, 2025
**Version**: Latest (including all v1.6.0+ features)
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Complete Feature List](#complete-feature-list)
4. [Database Models (27 Total)](#database-models)
5. [API Endpoints (150+)](#api-endpoints)
6. [Frontend Pages](#frontend-pages)
7. [Project Structure](#project-structure)
8. [Setup & Installation](#setup--installation)
9. [Recent Fixes & Updates](#recent-fixes--updates)
10. [Testing Credentials](#testing-credentials)

---

## 🎯 Project Overview

OWNLY is a comprehensive investment platform for Real Estate, Franchises, Startups, and Assets. It provides:
- **Investment Marketplace** - Browse and invest in deals
- **Portfolio Management** - Track investments and returns
- **SPV Management** - Complete cap table and financial tracking
- **SIP (Systematic Investment Plans)** - Recurring investments
- **Bundles** - Diversified investment packages
- **Copy Trading** - Follow successful investors
- **Secondary Market** - Resell investments
- **Scenarios** - Run financial projections
- **Operations** - Revenue, expenses, payouts

---

## 💻 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Email**: SendGrid
- **Payments**: Stripe

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript + JavaScript
- **Styling**: Tailwind CSS
- **State**: React Hooks
- **HTTP Client**: Axios
- **UI Components**: Custom components with glassmorphism

### Database
- **Type**: PostgreSQL
- **Models**: 27 (Sequelize ORM)
- **Features**: JSONB, Transactions, Indexes, Relations

---

## ✨ Complete Feature List

### 🔐 Authentication & User Management
- [x] User registration with email/password
- [x] JWT authentication
- [x] Role-based access control (8 roles)
  - `investor_retail` - Retail investors
  - `investor_hni` - High Net Worth Individuals
  - `investor_institutional` - Institutional investors
  - `admin` - Platform administrators
  - `operations` - Operations team
  - `agent` - Referral agents
  - `kyc_manager` - KYC verification
  - `finance_manager` - Financial management
- [x] User profiles with KYC status
- [x] User preferences and settings
- [x] Activity logging

### 💰 Investment Features
- [x] **Direct Deal Investments**
  - Browse deals marketplace
  - Filter by type, category, status, ROI
  - Search functionality
  - One-click investment from wallet
  - Auto SPV creation and share allocation

- [x] **Bundle Investments**
  - Curated deal packages
  - Diversification across multiple deals
  - Automatic allocation to underlying deals
  - Auto SPV creation for each deal in bundle
  - Weighted distribution

- [x] **SIP (Systematic Investment Plans)**
  - 15+ pre-built plans (Conservative to Aggressive)
  - Recurring monthly investments
  - Deal allocation across portfolio
  - Auto-execution and tracking
  - Plan management and monitoring

- [x] **Copy Trading**
  - Follow successful traders
  - Full profile copy or selective deals
  - Bundle-based copying
  - Individual deal copying
  - Automatic investment replication
  - Commission tracking for traders

### 📊 Portfolio & Analytics
- [x] Portfolio dashboard
  - Total invested amount
  - Current portfolio value
  - Returns (absolute and percentage)
  - Investment breakdown by type
  - Performance charts

- [x] Investment history
  - All transactions
  - Dates, amounts, status
  - Deal references
  - SPV assignments

- [x] **Monthly Earning Projections**
  - Deal-level monthly income display
  - Investor-level aggregated income
  - 36-month projection data
  - Rental/dividend income tracking

### 🏢 SPV Management
- [x] Auto-generate SPVs for deals
- [x] SPV code generation (SPV-YYYY-NNNN)
- [x] Cap table with investor breakdown
- [x] Share issuance and tracking
- [x] Operating and escrow balances
- [x] Revenue and expense tracking
- [x] Financial dashboard per SPV

### 💸 Operations & Financials
- [x] **Revenue Recording**
  - Multiple revenue types (rental, sales, services)
  - Automatic balance updates
  - Revenue history and categorization

- [x] **Expense Management**
  - Expense categories (maintenance, utilities, repairs)
  - Balance deductions
  - Expense tracking and audit

- [x] **Payout Distribution**
  - Generate payouts from SPV revenue
  - Automatic investor allocation by ownership %
  - Payout types (dividend, rental, profit share)
  - Distribution to investor wallets
  - Payout history

### 📈 Scenario Planning
- [x] Pre-built scenario templates
  - Perfect Flip (10% profit in 60 days)
  - Market Crash (15% loss)
  - Franchise Blowout (150% performance)
  - Delayed Exit (6 month delay)
  - Investment Default (70% loss)

- [x] Scenario execution engine
- [x] Timeline visualization
- [x] P&L calculations
- [x] Per-investor return breakdown
- [x] Annualized return metrics
- [x] Export results

### 🏪 Secondary Market
- [x] List investments for resale
- [x] Browse available listings
- [x] Price negotiations
- [x] Transfer of ownership
- [x] Commission tracking

### 👥 Agent System
- [x] Agent registration
- [x] Referral tracking
- [x] Commission calculations
- [x] Agent dashboard
- [x] Performance metrics

### 📝 Compliance & Documentation
- [x] KYC status tracking
- [x] Document management
- [x] Audit logs for all actions
- [x] Transaction history
- [x] Activity logging
- [x] Report generation
- [x] Announcements system

### 🎨 UI/UX Features
- [x] Responsive design (mobile-first)
- [x] Dark theme with glassmorphism
- [x] Animated gradient backgrounds
- [x] Loading states and skeletons
- [x] Error handling and validation
- [x] Toast notifications
- [x] Interactive charts
- [x] Modal dialogs
- [x] Hover effects and animations

### 🆕 Advanced Features
- [x] **Compare Feature**
  - Compare deals side-by-side
  - Compare bundles
  - Compare secondary market listings
  - Detailed comparison metrics

- [x] **ROI Calculator**
  - Interactive investment calculator
  - Monthly/annual/total projections
  - Holding period customization
  - Visual timeline
  - Break-even analysis

- [x] **Featured Opportunities**
  - Closing Soon deals
  - High Performers
  - Trending Now
  - Category showcases

- [x] **Investment Calculator Widget**
  - Standalone calculator page
  - Reinvestment toggle
  - Compound growth calculations
  - Quick scenario presets

- [x] **Social Proof**
  - Live activity feed
  - Investment/payout/exit events
  - Platform metrics
  - Trust signal badges

- [x] **Smart Recommendations**
  - AI-powered deal matching
  - Risk profile assessment
  - Match score visualization
  - Portfolio diversification insights

- [x] **Visual Portfolio Builder**
  - Interactive portfolio construction
  - Budget management
  - Real-time analytics
  - Diversification scoring

### 🎁 Rewards System
- [x] Copy Trading Commissions
  - 3-tier system (Starter/Pro/Elite)
  - 2% → 3% → 5% commission rates

- [x] Gift Cards
  - UAE brand partnerships
  - 0.5% → 1% → 2% bonuses
  - Emaar, Dubai Parks, Careem, MAF

---

## 🗄️ Database Models

### Core Models (7)
1. **User** - User accounts and authentication
2. **Wallet** - Financial balances and transactions
3. **Deal** - Investment opportunities
4. **SPV** - Special Purpose Vehicles
5. **Investment** - User investments in deals
6. **Payout** - Distributions to investors
7. **Transaction** - Financial transaction records

### Investment Products (4)
8. **Bundle** - Curated deal packages
9. **BundleDeal** - Bundle-Deal relationships (many-to-many)
10. **SIPPlan** - Systematic Investment Plans
11. **SIPSubscription** - User SIP subscriptions

### Financial Operations (3)
12. **PaymentMethod** - User payment methods
13. **PayoutSchedule** - Scheduled distributions
14. **SecondaryMarketListing** - Resale listings

### Analytics & Planning (2)
15. **Scenario** - Financial scenario modeling
16. **ScenarioResult** - Scenario execution results

### Operations & Compliance (6)
17. **Asset** - Physical assets under management
18. **Agent** - Referral agents
19. **AuditLog** - System audit trail
20. **ActivityLog** - User activity tracking
21. **Document** - Document management
22. **Announcement** - Platform announcements

### User Management (2)
23. **UserPreference** - User settings
24. **Notification** - User notifications

### Reports (1)
25. **Report** - Generated reports

### Integration Features (v1.6.0+)
26. **Webhook** - Webhook configurations
27. **WebhookDelivery** - Webhook delivery logs

### Copy Trading (3)
28. **CopyFollower** - Copy trading relationships
29. **CopyTransaction** - Copied investments
30. **InvestorBundle** - Custom investor bundles for copy trading

---

## 🔌 API Endpoints (150+)

### Authentication (`/api/auth`)
```
POST   /signup                 - Register new user
POST   /login                  - User login (JWT)
GET    /profile                - Get current user
PATCH  /profile                - Update user profile
POST   /logout                 - User logout
POST   /refresh-token          - Refresh JWT token
```

### Deals (`/api/deals`)
```
GET    /                       - List all deals (with filters)
POST   /                       - Create new deal (admin)
GET    /:id                    - Get deal details
PATCH  /:id                    - Update deal (admin)
DELETE /:id                    - Delete deal (admin)
POST   /:id/publish            - Publish deal (admin)
POST   /:id/close              - Close deal (admin)
GET    /category/:category     - Get deals by category
GET    /type/:type             - Get deals by type
GET    /featured               - Get featured deals
GET    /trending               - Get trending deals
```

### Investments (`/api/investments`)
```
POST   /                       - Create investment
GET    /my-investments         - Get user's investments
GET    /:id                    - Get investment details
PATCH  /:id/status             - Update investment status
GET    /deal/:dealId           - Get investments for a deal
POST   /:id/exit               - Exit investment (secondary market)
```

### Bundles (`/api/bundles`)
```
GET    /                       - List bundles
POST   /                       - Create bundle (admin)
GET    /:id                    - Get bundle details
PATCH  /:id                    - Update bundle
POST   /:id/publish            - Publish bundle
POST   /:id/close              - Close bundle
POST   /:id/invest             - Invest in bundle
GET    /category/:category     - Get bundles by category
```

### SIP (`/api/sip`)
```
GET    /plans                  - List SIP plans
POST   /plans                  - Create SIP plan (admin)
GET    /plans/:id              - Get plan details
POST   /subscribe              - Subscribe to plan
GET    /subscriptions          - Get user subscriptions
GET    /subscriptions/:id      - Get subscription details
PATCH  /subscriptions/:id      - Update subscription
POST   /subscriptions/:id/pause - Pause subscription
POST   /subscriptions/:id/resume - Resume subscription
POST   /subscriptions/:id/cancel - Cancel subscription
POST   /execute-investments    - Execute monthly SIP investments
```

### Copy Trading (`/api/copy-trading`)
```
GET    /traders                - List top traders
GET    /traders/:id            - Get trader profile
POST   /follow                 - Follow a trader
GET    /following              - Get user's following list
DELETE /unfollow/:id           - Unfollow trader
GET    /followers              - Get user's followers
GET    /performance/:id        - Get trader performance
```

### SPV (`/api/spvs`)
```
GET    /                       - List SPVs
POST   /                       - Create SPV (admin)
GET    /:id                    - Get SPV details
PATCH  /:id                    - Update SPV
GET    /:id/cap-table          - Get cap table
GET    /:id/transactions       - Get SPV transactions
GET    /:id/documents          - Get SPV documents
```

### Operations (`/api/operations`)
```
POST   /spv/:id/revenue        - Record revenue
POST   /spv/:id/expense        - Record expense
GET    /spv/:id/financials     - Get financial summary
GET    /spv/:id/revenue-history - Get revenue history
GET    /spv/:id/expense-history - Get expense history
```

### Payouts (`/api/payouts`)
```
GET    /                       - List payouts
POST   /generate               - Generate payout from revenue
POST   /:id/distribute         - Distribute payout to investors
GET    /:id                    - Get payout details
GET    /investor/:userId       - Get investor payouts
GET    /spv/:spvId             - Get SPV payouts
GET    /spv/:id/simulate       - Simulate monthly payout
```

### Scenarios (`/api/scenarios`)
```
GET    /templates              - List scenario templates
GET    /                       - List user scenarios
POST   /                       - Create scenario
GET    /:id                    - Get scenario details
POST   /:id/run                - Execute scenario
GET    /:id/results            - Get scenario results
DELETE /:id                    - Delete scenario
```

### Secondary Market (`/api/secondary-market`)
```
GET    /listings               - List available listings
POST   /list                   - Create listing
GET    /:id                    - Get listing details
PATCH  /:id                    - Update listing
DELETE /:id                    - Cancel listing
POST   /:id/purchase           - Purchase listing
GET    /my-listings            - Get user listings
```

### Wallet (`/api/wallet`)
```
GET    /balance                - Get wallet balance
GET    /transactions           - Get transaction history
POST   /add-funds              - Add funds to wallet
POST   /withdraw               - Withdraw funds
GET    /transaction/:id        - Get transaction details
```

### Search (`/api/search`)
```
GET    /                       - Global search
GET    /deals                  - Search deals
GET    /investments            - Search investments
GET    /users                  - Search users (admin)
GET    /spvs                   - Search SPVs
```

### Reports (`/api/reports`)
```
GET    /                       - List reports
POST   /generate               - Generate report
GET    /:id                    - Get report details
GET    /:id/download           - Download report file
DELETE /:id                    - Delete report
```

### Notifications (`/api/notifications`)
```
GET    /                       - Get user notifications
GET    /unread                 - Get unread count
PATCH  /:id/read               - Mark as read
PATCH  /mark-all-read          - Mark all as read
DELETE /:id                    - Delete notification
```

### Agents (`/api/agents`)
```
GET    /                       - List agents
POST   /register               - Register as agent
GET    /:id                    - Get agent details
GET    /:id/referrals          - Get agent referrals
GET    /:id/commissions        - Get commission earnings
PATCH  /:id                    - Update agent profile
```

### Documents (`/api/documents`)
```
GET    /                       - List documents
POST   /                       - Upload document
GET    /:id                    - Get document
DELETE /:id                    - Delete document
GET    /deal/:dealId           - Get deal documents
GET    /spv/:spvId             - Get SPV documents
```

### Admin (`/api/admin`)
```
GET    /dashboard              - Get admin dashboard stats
GET    /users                  - List all users
PATCH  /users/:id/role         - Update user role
GET    /platform-stats         - Get platform statistics
GET    /audit-logs             - Get audit logs
GET    /activity-logs          - Get activity logs
```

### User Preferences (`/api/preferences`)
```
GET    /                       - Get user preferences
PATCH  /                       - Update preferences
PATCH  /notifications          - Update notification settings
PATCH  /theme                  - Update theme preference
```

### Announcements (`/api/announcements`)
```
GET    /                       - List announcements
POST   /                       - Create announcement (admin)
GET    /:id                    - Get announcement
PATCH  /:id                    - Update announcement (admin)
DELETE /:id                    - Delete announcement (admin)
```

---

## 🎨 Frontend Pages

### Public Pages
- `/` - Home page with hero, features, testimonials
- `/login` - User login with quick access cards
- `/signup` - User registration
- `/about` - About OWNLY

### Investment Pages
- `/deals` - Browse all deals (with filters)
- `/deals/[id]` - Deal details with investment option
- `/bundles` - Browse bundles
- `/bundles/[id]` - Bundle details
- `/sip` - SIP landing page
- `/sip/plans` - Browse SIP plans
- `/sip/subscriptions` - Manage SIP subscriptions

### Portfolio & Dashboard
- `/dashboard` - User dashboard with overview
- `/portfolio` - Portfolio summary and breakdown
- `/investments` - Investment history
- `/wallet` - Wallet balance and transactions

### Trading & Market
- `/copy-trading` - Copy trading platform
- `/copy-trading/traders` - Browse traders
- `/copy-trading/trader/[id]` - Trader profile
- `/exchange` - Secondary market listings

### Operations
- `/operations` - SPV operations dashboard
- `/scenarios` - Scenario planning and templates

### Tools & Calculators
- `/calculator` - Investment calculator widget
- `/portfolio-builder` - Visual portfolio builder
- `/featured` - Featured opportunities dashboard
- `/compare` - Universal comparison tool

### Admin & Management
- `/admin` - Admin dashboard
- `/agent-dashboard` - Agent performance dashboard
- `/reports` - Reports and analytics
- `/communications` - Announcements
- `/activity` - Activity logs
- `/payout-schedules` - Payout scheduling
- `/settings` - User settings and preferences

### Rewards
- `/rewards` - Rewards program and gift cards

---

## 📁 Project Structure

```
ownly/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Wallet.js
│   │   │   ├── Deal.js
│   │   │   ├── SPV.js
│   │   │   ├── Investment.js
│   │   │   ├── Bundle.js
│   │   │   ├── BundleDeal.js
│   │   │   ├── SIPPlan.js
│   │   │   ├── SIPSubscription.js
│   │   │   ├── CopyFollower.js
│   │   │   ├── CopyTransaction.js
│   │   │   ├── InvestorBundle.js
│   │   │   └── ... (27 total models)
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── dealController.js
│   │   │   ├── investmentController.js
│   │   │   ├── bundleController.js
│   │   │   ├── sipController.js
│   │   │   ├── copyTradingController.js   # Fixed UUID array issue
│   │   │   ├── spvController.js
│   │   │   ├── payoutController.js
│   │   │   ├── operationsController.js
│   │   │   ├── scenarioController.js
│   │   │   └── ... (20+ controllers)
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── deals.js
│   │   │   ├── investments.js
│   │   │   ├── bundles.js
│   │   │   ├── sip.js
│   │   │   ├── copyTrading.js
│   │   │   └── ... (20+ route files)
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── authorization.js     # Role-based access
│   │   │   ├── validation.js        # Joi validation
│   │   │   ├── errorHandler.js      # Global error handling
│   │   │   └── rateLimiter.js       # Rate limiting
│   │   │
│   │   ├── config/
│   │   │   ├── database.js          # Sequelize config
│   │   │   ├── stripe.js            # Stripe setup
│   │   │   └── sendgrid.js          # Email setup
│   │   │
│   │   ├── scripts/
│   │   │   ├── seedData.js          # Seed database
│   │   │   ├── createOwnlyDeals.js  # Create OWNLY deals
│   │   │   ├── createSampleDeals.js # Create sample deals
│   │   │   └── importOwnlyData.js   # Import simulation data
│   │   │
│   │   ├── utils/
│   │   │   ├── response.js          # API response helpers
│   │   │   ├── logger.js            # Winston logger
│   │   │   └── helpers.js           # Utility functions
│   │   │
│   │   ├── server.js                # Express app entry
│   │   └── index.js
│   │
│   ├── logs/                        # Application logs
│   ├── uploads/                     # File uploads
│   ├── .env                         # Environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   │
│   │   ├── deals/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── bundles/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── sip/
│   │   │   ├── page.tsx
│   │   │   ├── plans/
│   │   │   └── subscriptions/
│   │   │
│   │   ├── copy-trading/
│   │   ├── portfolio/
│   │   ├── wallet/
│   │   ├── dashboard/
│   │   ├── calculator/
│   │   ├── featured/
│   │   ├── rewards/
│   │   └── ... (30+ pages)
│   │
│   ├── components/
│   │   ├── DealCard.tsx
│   │   ├── BundleCard.tsx
│   │   ├── InvestmentCard.tsx
│   │   ├── ROICalculator.tsx
│   │   ├── PortfolioBuilder.tsx
│   │   └── ... (50+ components)
│   │
│   ├── lib/
│   │   ├── api.ts                   # Axios client
│   │   ├── utils.ts                 # Helper functions
│   │   └── constants.ts             # App constants
│   │
│   ├── .env.local
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── README.md
├── DEVELOPER_GUIDE.md               # This file
├── FEATURES.md
├── SETUP_GUIDE.md
└── ... (30+ doc files)
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone Repository
```bash
git clone git@github.com:imrejaul007/ownly.git
cd ownly
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - SENDGRID_API_KEY

# Setup database and seed data
npm run setup:db

# Start backend
npm run dev
```

Backend will run on: **http://localhost:5001**

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5001
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key

# Start frontend
npm run dev
```

Frontend will run on: **http://localhost:3006** (or next available port)

### 4. Access Application
- **Frontend**: http://localhost:3006
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

---

## 🔧 Recent Fixes & Updates

### November 14, 2025
#### Copy Trading UUID Array Fix
**Problem**: PostgreSQL error `operator does not exist: uuid[] @> text[]` when filtering bundle followers in copy trading.

**Solution**: Replaced SQL-based UUID array comparison with JavaScript filtering.

**File**: `backend/src/controllers/copyTradingController.js` (lines 501-549)

**Changes**:
1. Simplified query to use `{ copy_type: 'bundle' }` as placeholder
2. Added manual JavaScript filtering after query using `Array.includes(dealId)`
3. Filters bundle followers by checking if their bundle contains the target dealId

**Commit**: `3126f5e` - "fix: resolve PostgreSQL UUID array type casting in copy trading"

---

## 🔑 Testing Credentials

### Investor Account (HNI)
- **Email**: fatima.alhashimi@example.ae
- **Password**: password123
- **Role**: investor_hni
- **Wallet**: Funded with test balance

### Admin Account
- **Email**: admin@ownly.ae
- **Password**: password123
- **Role**: admin
- **Access**: Full platform access

### Test Features
All accounts have:
- Pre-funded wallets
- Access to all deals
- Ability to invest, create bundles, subscribe to SIPs
- Full platform features

---

## 📊 Platform Statistics

- **Database Models**: 30
- **API Endpoints**: 150+
- **Frontend Pages**: 30+
- **React Components**: 50+
- **Lines of Code**: 60,000+
- **Deals**: 24 (simulation data)
- **Users**: 100+ (seeded)
- **SPVs**: Auto-generated per deal

---

## 🎯 Key Features Summary

1. **Investment Options**: Direct deals, Bundles, SIP, Copy Trading
2. **Portfolio Tools**: Dashboard, Analytics, ROI Calculator, Portfolio Builder
3. **Financial Operations**: Revenue, Expenses, Payouts, Distributions
4. **Planning Tools**: Scenarios, Projections, Comparisons
5. **Marketplace**: Primary and Secondary markets
6. **Rewards**: Copy trading commissions, Gift cards
7. **Admin**: Complete platform management
8. **Compliance**: KYC, Documents, Audit trails, Reports

---

## 📖 Additional Documentation

- **[README.md](README.md)** - Quick project overview
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[FEATURES.md](FEATURES.md)** - Feature list (older version)
- **[ROADMAP.md](ROADMAP.md)** - Future development plans
- **[PLATFORM_SUMMARY.md](PLATFORM_SUMMARY.md)** - Platform overview

---

## 🤝 Contributing

This is a proprietary platform. For issues or questions:
1. Check this developer guide first
2. Review other documentation files
3. Check git commit history for recent changes
4. Contact the development team

---

## 🔒 Security Notes

- All passwords are hashed with bcrypt
- JWT tokens for authentication
- Role-based authorization on all protected routes
- Input validation with Joi
- SQL injection protection via Sequelize ORM
- XSS protection with Helmet
- Rate limiting on API endpoints
- CORS configured for frontend origin

---

## 🏆 Best Practices

1. **Always use transactions** for financial operations
2. **Validate all inputs** before database operations
3. **Log all significant actions** for audit trail
4. **Handle errors gracefully** with proper error messages
5. **Test thoroughly** before deploying changes
6. **Document new features** in this guide
7. **Follow existing code patterns** for consistency

---

**Built with ❤️ for OWNLY**

**Last Updated**: November 14, 2025
**Maintained By**: Development Team
