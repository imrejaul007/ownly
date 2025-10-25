# OWNLY 36-Month Investment Simulation Dataset

## 📊 Overview

A complete, realistic investment simulation dataset covering 36 months (2022-01-01 to 2024-12-31) for the OWNLY Investment Platform.

**File:** `ownly-simulation-data.json` (2.4MB, 94,672 lines)

## 📈 Dataset Summary

| Category | Count | Details |
|----------|-------|---------|
| **Deals** | 24 | Across 6 investment categories + 4 bundles |
| **Investors** | 100 | 20 HNI + 80 Retail investors |
| **Investments** | 484 | Individual investment entries |
| **Transactions** | 8,496 | 36 months of activity |
| **Platform Metrics** | 36 | Monthly performance data |
| **Total Investment Volume** | AED 3.97M | Cumulative investments |
| **Platform Revenue** | AED 0.24M | From fees and commissions |

## 🎯 Deal Categories Coverage

### 1. FOCO / Franchise Investments (4 deals)
- **TikTok Café Franchise** - 48.6% ROI, 18 months, AED 1.36M target
- **Smart Gym Chain** - 27.3% ROI, 12 months, AED 2.76M target
- **Juice Bar Network** - 26.9% ROI, 18 months, AED 631K target
- **Fast Food Franchise** - 29% ROI, 18 months, AED 5.84M target

### 2. Real Estate (CrowdProp) (4 deals)
- **Dubai Marina Apartment Complex** - 15.4% ROI, 25 months
- **Downtown Dubai Office Tower** - Various ROI ranges
- **JBR Beachfront Villas** - Premium locations
- **Business Bay Retail Plaza** - Mixed-use development

### 3. Alternative Assets (4 deals)
- **Luxury Watch Collection** - 25-45% ROI range
- **Classic Car Fleet** - Vintage automobiles
- **Fine Art Portfolio** - Contemporary Middle Eastern art
- **Rare Whisky Casks** - Scottish single malt investment

### 4. Trade & Inventory Pools (4 deals)
- **Electronics Import Pool** - 4-8 month cycles
- **Fashion Inventory Fund** - Seasonal apparel
- **Automotive Parts Trading** - Import/export
- **FMCG Distribution Pool** - Fast-moving goods

### 5. Equity / HoldCo Investments (4 deals)
- **Tech Startup Series A** - 30-50% ROI, 2-5 years
- **Healthcare Services HoldCo** - Multi-clinic group
- **F&B Restaurant Group** - Multi-brand holding
- **E-commerce Platform** - Regional marketplace

### 6. Bundled Portfolios (4 deals)
- **Balanced Growth Portfolio** - Diversified mix
- **Luxury Investment Mix** - Premium assets
- **Smart Wealth Bundle** - Growth-focused
- **High Yield Package** - Performance-oriented

## 👥 Investor Profiles

### Distribution
- **20 HNI Investors**: AED 500K - 5M invested each
- **80 Retail Investors**: AED 50K - 500K invested each
- **95% KYC Approved**: Ready for active trading
- **60% Multi-Deal**: Invested across multiple categories

### Locations
Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah

### Typical Metrics per Investor
- **Total Invested**: Varies by type (HNI vs Retail)
- **Portfolio Value**: 12-35% growth
- **Active Deals**: 2-8 concurrent investments
- **Reinvestment Rate**: 20-60%

## 💼 Investment Data

Each investment entry includes:
- Investment ID, Deal ID, Investor ID
- Amount invested & investment date
- Expected ROI & actual returns
- Monthly earnings & payouts received
- Unrealized gains & exit values
- Status (Active/Exited)

## 💳 Transaction Types

### 36-Month Transaction History Includes:

1. **Investment** - New capital deployed
2. **Payout** - Monthly ROI distributions
3. **Reinvestment** - Earnings reinvested
4. **Exit** - Investment liquidation
5. **Fee** - Platform management fees (2%)
6. **Withdrawal** - Investor withdrawals

### Monthly Transaction Patterns:
- Consistent monthly payouts for active investments
- Random reinvestments (30% probability)
- Scheduled exits based on deal timelines
- New investments throughout the period

## 📊 Platform Metrics (Monthly)

Each month includes:
- New investor count & total investors
- Active deals count
- New investment volume (AED)
- Total payouts distributed
- Platform fees collected
- Exits processed
- Reinvestment volume
- Total portfolio value
- Platform revenue & expenses
- Net profit
- Portfolio growth percentage

## 🎨 ROI Distribution

### By Timeline:
- **Short-term** (4-8 months): Trade & Inventory - 8-18% ROI
- **Mid-term** (9-18 months): FOCO & Real Estate - 12-29% ROI
- **Long-term** (24-60 months): Equity & Assets - 20-50% ROI

### High Performers:
- TikTok Café: 48.6% ROI
- Tech Startup: 30-50% ROI range
- Luxury Assets: 25-45% ROI range

### Average Blended ROI:
**18-22%** across entire portfolio

## 📋 JSON Structure

```json
{
  "metadata": {
    "generatedAt": "timestamp",
    "period": "36 months",
    "currency": "AED",
    "totalDeals": 24,
    "totalInvestors": 100,
    "totalInvestments": 484,
    "totalTransactions": 8496
  },
  "deals": [...],
  "investors": [...],
  "investments": [...],
  "transactions": [...],
  "platformMetrics": [...]
}
```

## 🚀 How to Use This Data

### 1. Import into Database
```bash
# Example: Import deals
node importSimulationData.js --section=deals

# Import all sections
node importSimulationData.js --all
```

### 2. Visualize in Dashboard
- Use `platformMetrics` for monthly charts
- Use `transactions` for cash flow analysis
- Use `investments` for portfolio views
- Use `investors` for user analytics

### 3. Generate Reports
- **Portfolio Performance**: Group by investor/deal
- **Revenue Analysis**: Sum platform fees by month
- **Growth Trends**: Use platform metrics time series
- **ROI Analysis**: Compare expected vs actual returns

### 4. Test Analytics Features
- Time-series charts (36 months of data)
- Portfolio allocation breakdowns
- Investor segmentation analysis
- Deal performance comparisons

## 🎯 Key Use Cases

### For Dashboard
✅ Monthly earnings charts
✅ Portfolio growth visualization
✅ Asset allocation pie charts
✅ Performance metrics

### For Analytics
✅ Cohort analysis
✅ Investment trends
✅ ROI distribution analysis
✅ Platform growth metrics

### For Reports
✅ Investor statements
✅ Deal performance reports
✅ Platform revenue reports
✅ Tax documents preparation

### For Testing
✅ Load testing with realistic data
✅ UI/UX testing with varied scenarios
✅ Edge case testing (exits, reinvestments)
✅ Performance optimization

## 📁 File Location

```
/Users/rejaulkarim/Documents/ownly/backend/ownly-simulation-data.json
```

## 🔄 Regenerating Data

To generate fresh simulation data with different parameters:

```bash
cd /Users/rejaulkarim/Documents/ownly/backend
node src/scripts/generateSimulationData.js
```

The script will create a new `ownly-simulation-data.json` file with:
- Random but realistic values
- Consistent relationships between entities
- Smooth growth curves for analytics
- Proper date distributions across 36 months

## 💡 Data Characteristics

### Realistic Features:
✅ All amounts in AED
✅ Dates span Jan 2022 - Dec 2024
✅ Mix of active and exited deals
✅ Consistent investor behaviors
✅ Smooth growth trends
✅ Seasonal variations
✅ Random but believable distributions

### Ready for:
✅ Dashboard visualization
✅ Analytics and reporting
✅ Performance testing
✅ Demo presentations
✅ Investor onboarding
✅ Platform training

## 📞 Support

For questions or customization needs, refer to the generation script:
```
src/scripts/generateSimulationData.js
```

---

**Generated:** 2025-10-25
**Version:** 1.0
**Status:** Production-ready simulation data

🎉 **Ready to power your OWNLY platform with realistic investment data!**
