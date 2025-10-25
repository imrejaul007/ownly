# OWNLY Data Import Guide

## 📋 Overview

This guide explains how to import the comprehensive OWNLY dataset into the platform database.

**Import Script**: `/src/scripts/importOwnlyData.js` (370 lines)
**Data File**: `/seed-data.json` (172 lines currently - brands only)
**Status**: ✅ Ready to run once PostgreSQL is installed

---

## 🗂️ Current Data Structure

### What's Currently in seed-data.json

The file currently contains:
- ✅ 15 Brands (complete)
- ⏳ Investors data (pending - needs to be added)
- ⏳ Platform totals (pending - needs to be added)

```json
{
  "platform": "OWNLY",
  "generated_on": "2025-10-22",
  "brands": [ /* 15 brands */ ],
  "note": "Full investor data needed"
}
```

### Required Full Data Structure

For complete import, the seed-data.json needs this structure:

```json
{
  "platform": "OWNLY",
  "generated_on": "2025-10-22",
  "brands": [
    {
      "id": 1,
      "name": "Whiff Theory",
      "category": "Franchise",
      "niche": "Perfume Retail",
      "location": "Dubai Mall",
      "logo": "https://ownly.ae/logos/whiff_theory.png",
      "monthly_roi_pct": 5.0,
      "risk": "Medium",
      "min_invest": 20000
    }
    // ... 14 more brands
  ],
  "investors": [
    {
      "investor_id": "INV001",
      "name": "Ahmed Al-Mansoori",
      "email": "ahmed@example.com",
      "tier": "Platinum",
      "city": "Dubai",
      "joined": "2023-01-15",
      "initial_capital": 500000,
      "portfolio": [
        {
          "brand_id": 1,
          "brand": "Whiff Theory",
          "category": "Franchise",
          "location": "Dubai Mall",
          "initial_investment": 50000,
          "monthly_roi_base_pct": 5.0,
          "monthly_data": [
            {
              "month": "2023-01",
              "roi_percent": 5.2,
              "earned": 2600,
              "reinvested": 1040,
              "withdrawn": 1560,
              "portfolio_value": 51040
            }
            // ... 35 more months
          ],
          "exit_event": {
            "month": "2025-12",
            "exit_value": 75000,
            "exit_multiplier": 1.5
          }
        }
        // ... more portfolio items
      ]
    }
    // ... 19 more investors
  ],
  "platform_totals": {
    "total_invested": 2500000,
    "total_roi_distributed": 450000,
    "total_reinvested": 180000,
    "total_exits": 150000
  }
}
```

---

## 🔄 Import Process

The import script follows this 5-step process:

### Step 1: Import Brands as Deals
- Maps 15 brands to Deal model
- Converts category to deal_type (Franchise → franchise, Real Estate → real_estate, etc.)
- Stores original brand metadata in JSONB field
- Creates default admin user if needed

### Step 2: Import Investors as Users
- Creates 20 investor User accounts
- Maps tier to accredited_investor status (Platinum/Gold = true)
- Sets default password: `investor123`
- Sets KYC status to 'approved'
- Stores city, tier, initial_capital in preferences

### Step 3: Create Portfolio Investments
- Maps portfolio items to Investment model
- Links investors to brands/deals
- Sets status to 'active' or 'exited' based on exit_event
- Updates Deal.raised_amount and investor_count

### Step 4: Import Monthly ROI Transactions
- Creates Transaction records for each month's ROI
- Type: 'payout', Status: 'completed'
- Stores month, roi_percent, reinvested, withdrawn in metadata
- Creates exit event transactions with exit_value and multiplier

### Step 5: Create SPVs
- Creates SPV for each brand/deal
- Generates legal entity names
- Sets jurisdiction to 'UAE - DIFC'
- Links total_capital to deal's raised_amount

---

## 📊 Database Mapping

### Brand → Deal

```javascript
{
  title: brand.name,
  description: `${brand.niche} - ${brand.category}`,
  deal_type: dealTypeMap[brand.category],
  location: brand.location,
  target_raise: brand.min_invest * 10,
  min_investment: brand.min_invest,
  max_investment: brand.min_invest * 100,
  expected_return: brand.monthly_roi_pct * 12, // Annual
  investment_period: 36, // months
  status: 'active',
  metadata: {
    category: brand.category,
    niche: brand.niche,
    monthly_roi_pct: brand.monthly_roi_pct,
    risk_level: brand.risk,
    original_brand_id: brand.id
  }
}
```

### Investor → User

```javascript
{
  email: investor.email,
  password: bcrypt.hash('investor123', 10),
  full_name: investor.name,
  role: 'investor',
  verified: true,
  kyc_status: 'approved',
  accredited_investor: tier === 'Platinum' || tier === 'Gold',
  preferences: {
    tier: tierMap[investor.tier],
    city: investor.city,
    initial_capital: investor.initial_capital,
    original_investor_id: investor.investor_id
  }
}
```

### Monthly ROI → Transaction

```javascript
{
  investment_id: investmentId,
  user_id: userId,
  deal_id: dealId,
  type: 'payout',
  amount: monthData.earned,
  status: 'completed',
  description: `Monthly ROI - ${monthData.month} (${monthData.roi_percent}%)`,
  metadata: {
    month: monthData.month,
    roi_percent: monthData.roi_percent,
    reinvested: monthData.reinvested,
    withdrawn: monthData.withdrawn,
    portfolio_value: monthData.portfolio_value,
    transaction_type: 'roi_credit'
  },
  created_at: new Date(monthData.month + '-15') // Mid-month
}
```

---

## 🚀 How to Run the Import

### Prerequisites

1. **PostgreSQL must be installed and running**
   ```bash
   # Check if PostgreSQL is running
   pg_isready

   # If not running, start it (Homebrew)
   brew services start postgresql@14
   ```

2. **Database must be created and tables set up**
   ```bash
   # Create database
   createdb ownly_sandbox

   # Setup tables
   cd /Users/rejaulkarim/Documents/ownly/backend
   npm run setup:db
   ```

3. **Full dataset must be in seed-data.json**
   - Currently only has brands
   - Add investors array with portfolio and monthly_data
   - Add platform_totals object

### Running the Import

```bash
cd /Users/rejaulkarim/Documents/ownly/backend

# Run the import script
node src/scripts/importOwnlyData.js
```

### Expected Output

```
🚀 Starting OWNLY data import...
📊 Dataset info: OWNLY - Generated on 2025-10-22
✅ Database connection established

📦 Step 1/5: Importing brands as deals...
  ✅ Imported brand: Whiff Theory (ID: 1 -> <uuid>)
  ✅ Imported brand: Aroma Souq (ID: 2 -> <uuid>)
  ... (15 total)
✅ Imported 15 brands

👥 Step 2/5: Importing investors...
  ✅ Imported investor: Ahmed Al-Mansoori (INV001 -> <uuid>)
  ... (20 total)
✅ Imported 20 investors

💼 Step 3/5: Importing portfolio investments...
  ✅ Invested: Ahmed Al-Mansoori -> Whiff Theory (50000 AED)
  ... (multiple investments)
✅ Created XX investments

💰 Step 4/5: Importing monthly ROI transactions...
✅ Created XXXX transactions (ROI + exits)

🏢 Step 5/5: Creating SPVs for deals...
✅ Created 15 SPVs

═══════════════════════════════════════════════════════
🎉 OWNLY DATA IMPORT COMPLETED SUCCESSFULLY
═══════════════════════════════════════════════════════
✅ Brands (Deals): 15
✅ Investors (Users): 20
✅ Investments: XX
✅ Transactions: XXXX
✅ SPVs: 15
═══════════════════════════════════════════════════════

📊 Platform Totals (from dataset):
   Total Invested: 2,500,000 AED
   Total ROI Distributed: 450,000 AED
   Total Reinvested: 180,000 AED
   Total Exits: 150,000 AED

🔐 Default Login Credentials:
   Admin: admin@ownly.ae / admin123
   Investors: [investor-email] / investor123
```

---

## 🧪 Verifying the Import

### Check Database Records

```bash
# Connect to database
psql ownly_sandbox

# Check counts
SELECT COUNT(*) FROM deals;        -- Should be 15
SELECT COUNT(*) FROM users WHERE role = 'investor';  -- Should be 20
SELECT COUNT(*) FROM investments;  -- Should match portfolio items
SELECT COUNT(*) FROM transactions WHERE type = 'payout';  -- Should match ROI + exits
SELECT COUNT(*) FROM spvs;         -- Should be 15
```

### Test API Endpoints

```bash
# Get all deals
curl http://localhost:5000/api/deals

# Get investors
curl http://localhost:5000/api/users?role=investor

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ownly.ae","password":"admin123"}'

# Login as investor (use any investor email)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<investor-email>","password":"investor123"}'
```

### Check Frontend

Visit http://localhost:3002 and verify:
- Deals page shows 15 brands
- Each deal has proper details, location, ROI percentage
- Investment data shows realistic amounts
- Transaction history shows monthly payouts

---

## 📈 Expected Data Volume

With full 20 investors, 36 months of history:

| Entity | Estimated Count |
|--------|----------------|
| Deals | 15 |
| Users (Investors) | 20 |
| Users (Admin) | 1 |
| Investments | 60-100 (varies by portfolio size) |
| Transactions (ROI) | 2,000-3,600 (60-100 investments × 36 months) |
| Transactions (Exits) | 10-20 (some investments have exits) |
| SPVs | 15 |
| **Total Records** | **~2,100-3,800** |

---

## 🔧 Troubleshooting

### Import fails with "database connection refused"
- PostgreSQL is not running
- Run: `brew services start postgresql@14`
- Verify: `pg_isready`

### Import fails with "relation does not exist"
- Database tables not created
- Run: `npm run setup:db`

### Import fails with "seed-data.json not found"
- File must be at: `/Users/rejaulkarim/Documents/ownly/backend/seed-data.json`
- Verify path in error message

### No investors imported
- The `investors` array is missing from seed-data.json
- Add the full investor dataset structure shown above

### Transactions not created
- Investor portfolio items missing `monthly_data` array
- Each portfolio item needs 36 months of monthly_data

---

## 🎯 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Import Script | ✅ Ready | 370 lines, fully tested syntax |
| Brands Data | ✅ Complete | 15 brands in seed-data.json |
| Investors Data | ⏳ Pending | Need to add to seed-data.json |
| Database | ❌ Not Ready | PostgreSQL needs installation |
| Backend Server | ⏳ Waiting | Code ready, needs DB connection |
| Frontend Server | ✅ Running | http://localhost:3002 |

---

## 📝 Next Steps

1. **Install PostgreSQL** (if not already installed)
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create database and tables**
   ```bash
   createdb ownly_sandbox
   cd /Users/rejaulkarim/Documents/ownly/backend
   npm run setup:db
   ```

3. **Add full investor data to seed-data.json**
   - Add the `investors` array with all 20 investors
   - Include their portfolio items
   - Include 36 months of monthly_data for each investment
   - Add platform_totals object

4. **Run the import**
   ```bash
   node src/scripts/importOwnlyData.js
   ```

5. **Verify and test**
   - Check database records
   - Test API endpoints
   - Login to frontend with sample accounts
   - Explore the populated data

---

## 💡 Sample Data Preview

The import will create realistic data like:

- **Ahmed Al-Mansoori** (Platinum investor from Dubai)
  - Initial capital: 500,000 AED
  - Invested in: Whiff Theory (50,000 AED)
  - Monthly ROI: ~2,600 AED (5.2%)
  - 36 months of returns tracked
  - Exit event: 75,000 AED (1.5x return)

- **Whiff Theory** (Franchise in Dubai Mall)
  - Category: Perfume Retail
  - Min Investment: 20,000 AED
  - Monthly ROI: 5.0%
  - Multiple investors
  - Full SPV structure

---

**Script Location**: `/Users/rejaulkarim/Documents/ownly/backend/src/scripts/importOwnlyData.js`
**Data File**: `/Users/rejaulkarim/Documents/ownly/backend/seed-data.json`
**Documentation**: This guide

**Ready to import!** Just need PostgreSQL running and full dataset in place.
