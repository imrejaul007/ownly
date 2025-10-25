# OWNLY Sandbox - Quick Start (2 Minutes)

## Prerequisites
- PostgreSQL installed and running
- Node.js v18+ installed

## Steps

### 1. Create Database
```bash
psql postgres -c "CREATE DATABASE ownly_sandbox;"
```

### 2. Install & Seed Backend
```bash
cd backend
npm install
npm run db:seed
```

### 3. Install Frontend
```bash
cd ../frontend
npm install
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### 5. Open Browser
- Frontend: http://localhost:3000
- Login: admin@ownly.io / password123

## That's it!

You now have:
- ✅ 100 dummy investors
- ✅ 50 deals across 4 categories
- ✅ 20 active SPVs
- ✅ Sample investments
- ✅ Full marketplace and portfolio

## What to Try

1. **Browse Deals** - Go to http://localhost:3000
2. **Invest in a Deal** - Click any deal → "Invest Now" → Enter amount → Confirm
3. **View Portfolio** - Navigate to Portfolio page
4. **Create New Deal** - Login as admin → Admin panel → Create deal

## Troubleshooting

**Database error?**
```bash
psql postgres -c "CREATE DATABASE ownly_sandbox;"
```

**Port 5000 in use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Need fresh data?**
```bash
cd backend && npm run db:seed
```

For detailed setup, see [SETUP.md](./SETUP.md)
