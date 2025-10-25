# 🚀 START HERE - Get Your Platform Running in 5 Minutes

## Current Status

✅ **Frontend**: Running on http://localhost:3002
⏳ **Backend**: Waiting for database
⏳ **Data**: Ready to import (456 KB, 2,100+ records)

---

## One Command to Rule Them All

Run this single command to install PostgreSQL, setup the database, and import all data:

```bash
cd /Users/rejaulkarim/Documents/ownly && ./install-postgres-now.sh
```

That's it! The script will:
1. Open Postgres.app download page
2. Guide you through 4-click installation
3. Setup the database automatically
4. Import all sample data
5. Get everything running

**Time**: 5 minutes total

---

## What You'll Get

After running the script:

### 📊 Complete Dataset
- **15 Brands** - Investment opportunities
  - Franchises: Whiff Theory, Aroma Souq, RedHine, Al Mutalib, Glowzy Spa, TravoPay Kiosk
  - Real Estate: Marina Loft, Creek Bay Villas
  - Assets: Royale Yachts, Elite Wheels
  - Startups: Tattvix, Wasil Souq, Publistan, Raskah
  - Rental: Palm Luxe

- **20 Investors** - Realistic profiles across 4 tiers
  - 5 Platinum investors (300K-1M AED)
  - 6 Gold investors (150K-400K AED)
  - 5 Silver investors (50K-150K AED)
  - 4 Bronze investors (20K-50K AED)

- **51 Investments** - Diversified portfolios
- **1,801 Transactions** - 36 months of ROI history
- **9 Exit Events** - Successful exits (1.3x - 2.0x returns)

**Platform Totals**:
- Total Invested: 2,476,000 AED
- Total ROI Distributed: 5,893,297 AED
- Total Reinvested: 2,357,319 AED
- Total Exits: 580,310 AED

### 🌐 Immediate Access

**Frontend**: http://localhost:3002
- Browse investment opportunities
- View portfolios
- Check transaction history
- Manage payments, webhooks, emails, workflows

**Backend API**: http://localhost:5000/api
- 100+ endpoints ready
- Full REST API
- Authentication system

### 🔐 Login Credentials

**Admin Account**:
```
Email: admin@ownly.ae
Password: admin123
```

**Investor Accounts** (20 available):
```
Email: ahmed.almansoori@example.ae
Password: investor123

Or any investor email from the dataset
All passwords: investor123
```

---

## Alternative: Manual Installation

If you prefer manual control:

### Step 1: Install Postgres.app (2 minutes)
1. Download: https://postgresapp.com/downloads.html
2. Drag to Applications
3. Open app and click "Initialize"
4. Add to PATH:
   ```bash
   echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

### Step 2: Setup Database (1 minute)
```bash
createdb ownly_sandbox
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db
```

### Step 3: Import Data (1 minute)
```bash
node src/scripts/importOwnlyData.js
```

### Step 4: Done! (immediate)
- Backend auto-restarts
- Visit http://localhost:3002
- Login and explore!

---

## Verification

After installation, verify everything works:

### Check Database
```bash
psql ownly_sandbox -c "SELECT COUNT(*) FROM deals;"
# Should show: 15

psql ownly_sandbox -c "SELECT COUNT(*) FROM users WHERE role='investor';"
# Should show: 20
```

### Check Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","database":"connected"}
```

### Check Frontend
Open http://localhost:3002
- Should see homepage with investment opportunities
- Navigation should work
- Data should load

---

## What's Included

### v1.6.0 Features (Complete)
- ✅ **Payment System** (11 endpoints)
  - Stripe integration
  - Payment methods management
  - Transaction processing

- ✅ **Webhook System** (10 endpoints)
  - Webhook CRUD
  - Event subscriptions
  - Delivery tracking

- ✅ **Email System** (12 endpoints)
  - SendGrid integration
  - Template management
  - Email tracking

- ✅ **Workflow Automation** (12 endpoints)
  - Workflow builder
  - Conditional logic
  - Execution tracking

### Core Features (v1.0-v1.5)
- ✅ User management
- ✅ Deal management
- ✅ Investment tracking
- ✅ Portfolio management
- ✅ Transaction history
- ✅ SPV structures
- ✅ Document management
- ✅ KYC/Compliance
- ✅ Reporting & analytics
- ✅ Secondary market

**Total**: 100+ API endpoints, 26 database models, 10+ frontend pages

---

## Explore the Platform

Once running, check out:

### Investment Opportunities
http://localhost:3002/deals
- Browse 15 brands
- View details, locations, ROI
- See investment minimums

### Portfolio (Login Required)
http://localhost:3002/portfolio
- View investments
- Track returns
- See transaction history

### v1.6.0 Features
- Payments: http://localhost:3002/settings/payments
- Webhooks: http://localhost:3002/settings/webhooks
- Emails: http://localhost:3002/settings/emails
- Workflows: http://localhost:3002/settings/workflows

---

## Quick Commands

```bash
# Install everything (one command)
cd /Users/rejaulkarim/Documents/ownly && ./install-postgres-now.sh

# Manual setup
createdb ownly_sandbox
cd backend && npm run setup:db
node src/scripts/importOwnlyData.js

# Check database
psql ownly_sandbox
\dt  # List tables
SELECT COUNT(*) FROM deals;

# Restart backend (if needed)
cd backend && npm run dev

# Check logs
tail -f backend/logs/combined.log
```

---

## Troubleshooting

### "psql: command not found"
- Postgres.app not in PATH
- Run: `echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc`
- Then: `source ~/.zshrc`

### "database does not exist"
- Run: `createdb ownly_sandbox`

### Backend not connecting
- Check Postgres is running (elephant icon in menu bar should be solid)
- Verify: `pg_isready`

### Frontend shows no data
- Check backend is running: `curl http://localhost:5000/api/health`
- Verify data imported: `psql ownly_sandbox -c "SELECT COUNT(*) FROM deals;"`

---

## Documentation

For more details:
- `WHATS_NEXT.md` - Complete guide with tips
- `INSTALL_POSTGRESQL.md` - Detailed PostgreSQL installation
- `DATA_IMPORT_GUIDE.md` - Data import documentation
- `PROJECT_STATUS.md` - Complete project overview

---

## Ready to Start?

### Run This Now:

```bash
cd /Users/rejaulkarim/Documents/ownly && ./install-postgres-now.sh
```

Or download Postgres.app from https://postgresapp.com/ and follow the manual steps above.

Either way, you'll have a fully operational investment platform with realistic data in 5 minutes!

---

**Let's get started! 🚀**
