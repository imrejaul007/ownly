# 🌟 Showcase Investor: Ahmed Al-Mansoori

## Complete Portfolio Demonstration

Login with this account to see EVERYTHING:
```
Email: ahmed.almansoori@example.ae
Password: investor123
```

---

## 📊 What You'll See

### Portfolio Overview

**8 Investments Across ALL 5 Categories:**

1. **Franchise Investments** (3)
   - Al Mutalib (Marina Walk) - 190,000 AED
   - Whiff Theory (Dubai Mall) - 54,000 AED
   - Whiff Theory (Dubai Mall) - 53,000 AED

2. **Real Estate Investment** (1)
   - Creek Bay Villas (Dubai Creek Harbour) - 5,000 AED

3. **Asset Investment** (1)
   - Royale Yachts (Palm Jumeirah Marina) - 127,000 AED

4. **Startup Investments** (2)
   - Wasil Souq (Dubai Internet City) - 31,000 AED
   - Wasil Souq (Dubai Internet City) - 21,000 AED

5. **Rental Investment** (1)
   - Palm Luxe (JBR) - 2,000 AED

---

## 💰 Financial Summary

| Metric | Amount |
|--------|--------|
| **Total Invested** | 483,000 AED |
| **Monthly Earnings** | 1,263,831 AED |
| **Exit Proceeds** | 340,930 AED |
| **Total Return** | 1,604,761 AED |
| **Net Profit** | 1,121,761 AED |
| **ROI** | 232% |

---

## 📈 Monthly Earnings Tracking

**282 Monthly Payment Records**

Each month shows:
- **Date**: Month and year (Jan 2023 - Dec 2025)
- **Amount Earned**: Monthly ROI payment
- **ROI Percentage**: Actual ROI for that month (varies ±15%)
- **Reinvested**: 40% automatically reinvested
- **Withdrawn**: 60% paid out
- **Portfolio Value**: Growing total value

**Sample Monthly Earnings:**
```
2023-01: 9,089 AED (4.78% ROI)
2023-02: 11,176 AED (5.77% ROI)
2023-03: 11,125 AED (5.62% ROI)
...continues for 36 months
```

---

## 🎯 Exit Events (3 Successful Exits)

### 1. Royale Yachts Exit
- **Investment**: 127,000 AED
- **Exit Value**: 184,150 AED
- **Multiplier**: 1.45x
- **Profit**: 57,150 AED
- **Duration**: 34 months

### 2. Wasil Souq Exit
- **Investment**: 31,000 AED
- **Exit Value**: 55,800 AED
- **Multiplier**: 1.8x
- **Profit**: 24,800 AED
- **Duration**: 34 months

### 3. Whiff Theory Exit
- **Investment**: 54,000 AED
- **Exit Value**: 100,980 AED
- **Multiplier**: 1.87x
- **Profit**: 46,980 AED
- **Duration**: 34 months

**Total Exit Profits**: 128,930 AED

---

## 🌐 What You'll See on Each Page

### Portfolio Page
http://localhost:3002/portfolio

**Investment Cards** showing:
- Brand name and logo
- Category badge (Franchise, Real Estate, etc.)
- Location
- Initial investment amount
- Current portfolio value (with reinvestment growth)
- Monthly ROI percentage
- Status: Active or Exited
- Action buttons (View Details, View Transactions)

### Transaction History Page
http://localhost:3002/transactions

**282 Transaction Records** including:

**Monthly ROI Payments** (279 records):
- Date
- Type: "Monthly ROI Payment"
- Investment: Brand name
- Amount earned
- ROI percentage
- Breakdown: Reinvested vs Withdrawn
- Running portfolio value

**Exit Events** (3 records):
- Date
- Type: "Exit Event"
- Investment: Brand name
- Exit value
- Multiplier (1.45x, 1.8x, 1.87x)
- Total profit

### Investment Details Page
For each investment, you'll see:
- Complete 36-month earnings history
- Monthly ROI chart
- Portfolio value growth chart
- Total earnings to date
- Reinvestment summary
- Exit information (if applicable)

---

## 🔍 Real Data Examples

### Sample Investment: Al Mutalib Franchise

**Investment Details:**
- Initial Investment: 190,000 AED
- Location: Marina Walk
- Category: Franchise (Luxury Oud)
- Base Monthly ROI: 5.2%
- Duration: 36 months (Active)

**Monthly Earnings Sample:**
```
Month       | ROI %  | Earned    | Reinvested | Withdrawn | Portfolio Value
------------|--------|-----------|------------|-----------|----------------
2023-01     | 4.78%  | 9,089 AED | 3,635 AED  | 5,454 AED | 193,635 AED
2023-02     | 5.77%  | 11,176 AED| 4,470 AED  | 6,706 AED | 198,105 AED
2023-03     | 5.62%  | 11,125 AED| 4,450 AED  | 6,675 AED | 202,555 AED
2023-04     | 4.93%  | 9,985 AED | 3,994 AED  | 5,991 AED | 206,549 AED
...continues for 36 months
```

### Sample Investment with Exit: Royale Yachts

**Investment Details:**
- Initial Investment: 127,000 AED
- Location: Palm Jumeirah Marina
- Category: Asset (Yacht Charter)
- Base Monthly ROI: 6.0%
- Duration: 34 months

**Exit Event:**
```
Exit Month: 2025-11
Exit Value: 184,150 AED
Exit Multiplier: 1.45x
Initial Investment: 127,000 AED
Total Earned (Monthly): 107,150 AED (estimated)
Exit Profit: 57,150 AED
Total Return: ~164,300 AED
Final ROI: ~129%
```

---

## 📱 Navigation Flow

1. **Login** as ahmed.almansoori@example.ae
2. **Dashboard** shows:
   - 8 active investments
   - Total portfolio value
   - Total earnings
   - Recent transactions
3. **Click "Portfolio"** to see all 8 investments
4. **Click any investment** to see:
   - 36-month earnings history
   - Charts and graphs
   - Exit details (if applicable)
5. **Click "Transactions"** to see all 282 records
6. **Filter by**:
   - Investment type
   - Date range
   - Transaction type (ROI vs Exit)

---

## 🎯 Testing Scenarios

### Scenario 1: View Diverse Portfolio
- Login as Ahmed
- Navigate to Portfolio
- See investments in Franchise, Real Estate, Asset, Startup, Rental
- Each shows different ROI percentages

### Scenario 2: Track Monthly Earnings
- Click on any active investment
- Scroll through 36 months of earnings
- See ROI percentage vary each month (±15%)
- See portfolio value growing with reinvestment

### Scenario 3: View Successful Exits
- Go to Transaction History
- Filter by "Exit Events"
- See 3 successful exits
- Each shows multiplier and profit

### Scenario 4: Calculate Total Returns
- Portfolio page shows total value
- Transaction history shows all earnings
- Exit events show exit proceeds
- Dashboard calculates total ROI

---

## 📊 Data Verification

To verify the data after import:

```sql
-- Check Ahmed's investments
SELECT
  d.title,
  d.deal_type,
  i.amount as investment,
  i.status,
  COUNT(t.id) as transaction_count
FROM investments i
JOIN deals d ON i.deal_id = d.id
JOIN users u ON i.user_id = u.id
LEFT JOIN transactions t ON t.investment_id = i.id
WHERE u.email = 'ahmed.almansoori@example.ae'
GROUP BY d.title, d.deal_type, i.amount, i.status;

-- Should show 8 investments with ~35 transactions each
```

---

## 🎉 Summary

Ahmed Al-Mansoori's profile demonstrates:

✅ **Portfolio Diversity**: All 5 investment categories
✅ **Monthly Tracking**: 282 monthly payment records
✅ **Exit Events**: 3 successful exits with clear profits
✅ **Long History**: 36 months of data
✅ **Real Growth**: Portfolio growing from 483K to 1.6M+ AED
✅ **Clear ROI**: Each month shows percentage and amount
✅ **Reinvestment**: 40% reinvested, 60% withdrawn (visible)
✅ **Multiple Brands**: 6 different brands invested

**This is exactly what you wanted to see!** 🚀

Once PostgreSQL is installed and data is imported, login as Ahmed to explore the complete investment journey.

---

**Login**: ahmed.almansoori@example.ae / investor123
