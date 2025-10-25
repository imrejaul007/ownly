# OWNLY Sandbox - Release Notes

## Version 1.1.0 (Current) - October 2024

### 🎉 Major New Features

#### 1. Scenario Runner
The most requested feature is here! Run business scenarios and simulate investment outcomes.

**What's New:**
- 5 pre-built scenario templates (Perfect Flip, Market Crash, Franchise Blowout, Delayed Exit, Default)
- Real-time P&L calculation with fees and expenses
- Per-investor return breakdown
- Timeline visualization of events
- Annualized return metrics
- Exit multiple modeling
- Market condition simulation

**Pages Added:**
- `/scenarios` - Scenario runner interface
- Scenario results modal with detailed breakdown

**API Endpoints:**
- `GET /api/scenarios` - List scenarios
- `GET /api/scenarios/templates` - Get templates
- `POST /api/scenarios` - Create scenario
- `POST /api/scenarios/:id/run` - Execute scenario
- `GET /api/scenarios/:id/results` - View results
- `DELETE /api/scenarios/:id` - Delete scenario

#### 2. Operations & Payouts
Complete financial operations management for SPVs.

**What's New:**
- Generate payouts based on SPV performance
- Automatic distribution to investors by ownership percentage
- Record revenue by category (rental, sales, services)
- Track expenses by category (maintenance, utilities, repairs)
- Real-time financial dashboard
- Payout history tracking
- SPV balance management

**Pages Added:**
- `/operations` - Operations and payout management interface
- Three tabs: Payouts, Revenue, Expenses

**API Endpoints:**
- `POST /api/payouts/generate` - Generate payout
- `POST /api/payouts/:id/distribute` - Distribute payout
- `GET /api/payouts` - List payouts
- `GET /api/payouts/:id` - Get payout details
- `GET /api/payouts/spv/:id/simulate` - Simulate payout
- `POST /api/operations/spv/:id/revenue` - Record revenue
- `POST /api/operations/spv/:id/expense` - Record expense
- `GET /api/operations/spv/:id/financials` - Get financials

#### 3. Enhanced Navigation
Updated navigation to include all new features.

**What's New:**
- Added "Scenarios" link in header
- Added "Operations" link in header
- Improved mobile responsiveness
- Better visual hierarchy

### 🔧 Technical Improvements

**Backend:**
- New `scenarioController.js` with 5 scenario templates
- New `payoutController.js` for payout management
- New `operationsController.js` for revenue/expense tracking
- Transaction-safe payout distribution
- Audit logging for all financial operations
- Improved error handling

**Frontend:**
- New scenario runner page with modal results
- New operations page with tabbed interface
- Enhanced API client with new endpoints
- Improved loading states
- Better error messages

**Database:**
- Enhanced `Scenario` model with results storage
- Enhanced `Payout` model with distribution tracking
- `AuditLog` model for compliance tracking
- Optimized queries for financial data

### 📊 Feature Highlights

**Scenario Runner:**
```
Perfect Flip Scenario:
- Duration: 60 days
- Exit Multiple: 1.10x
- Expected Return: +10%
- Timeline: Acquisition → Marketing → Offer → Exit
```

**Operations & Payouts:**
```
Monthly Payout Example:
- Total Amount: $50,000
- Investors: 15
- Distribution: Automatic by ownership %
- Status: Distributed
- Date: Oct 2024
```

### 🎯 Use Cases Enabled

1. **Sales Demos:**
   - Show "what-if" scenarios
   - Demonstrate ROI calculations
   - Simulate market conditions

2. **Operations:**
   - Generate monthly payouts
   - Track revenue and expenses
   - Monitor SPV financials

3. **Investor Education:**
   - Understand scenario outcomes
   - See distribution mechanics
   - Learn about returns

4. **Regulatory Compliance:**
   - Audit trail of all operations
   - Financial reporting
   - Transaction history

### 📈 Statistics

- **6 new API endpoints** for scenarios
- **7 new API endpoints** for payouts/operations
- **2 new frontend pages**
- **5 scenario templates** built-in
- **3 financial categories** for tracking

---

## Version 1.0.0 - October 2024

### Initial Release

**Core Features:**
- User authentication with 8 roles
- Deal marketplace with 50+ pre-seeded deals
- Investment flow with dummy wallet
- Portfolio tracking
- SPV management
- Admin panel for deal creation
- Cap table viewing
- Database with 11 models

**Technical Stack:**
- Backend: Express.js + PostgreSQL
- Frontend: Next.js 14 + TypeScript + Tailwind
- Authentication: JWT
- ORM: Sequelize

**Pre-seeded Data:**
- 100 investors
- 50 deals across 4 types
- 20 SPVs
- 5 admin users
- 20 agents

---

## Upgrade Instructions

### From v1.0.0 to v1.1.0

**Backend:**
```bash
cd backend

# Pull latest code
git pull

# Install any new dependencies
npm install

# No database migration needed - seed script handles new data
```

**Frontend:**
```bash
cd frontend

# Pull latest code
git pull

# Install any new dependencies
npm install

# Restart dev server
npm run dev
```

**Database:**
No migration required. The seed script automatically creates all necessary data structures.

---

## Breaking Changes

None. Version 1.1.0 is fully backward compatible with 1.0.0.

---

## Known Issues

None at this time.

---

## Roadmap

### Version 1.2.0 (Planned)
- Secondary market for investment resale
- Agent referral dashboard
- KYC document upload
- Email/SMS notifications
- Export to CSV/PDF

### Version 2.0.0 (Future)
- Multi-currency support
- Custom scenario builder
- Automated payout scheduling
- WebSocket real-time updates
- Mobile app

---

## Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/ownly/sandbox/issues)
- Documentation: See [SETUP.md](./SETUP.md)
- Features: See [FEATURES.md](./FEATURES.md)

---

## Contributors

Built with ❤️ by the OWNLY team.

---

**Current Version:** 1.1.0
**Release Date:** October 2024
**Status:** Production-Ready Sandbox
