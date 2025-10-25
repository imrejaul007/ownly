# OWNLY Sandbox - Setup Guide

Complete setup instructions for running the OWNLY Sandbox platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional)

## Quick Start (5 Minutes)

### 1. Database Setup

First, create a PostgreSQL database for the sandbox:

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE ownly_sandbox;

# Create user (optional - or use your existing postgres user)
CREATE USER ownly_user WITH PASSWORD 'ownly_pass';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ownly_sandbox TO ownly_user;

# Exit
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done, but if needed)
npm install

# The .env file is already configured with default values
# Edit backend/.env if you need to change database credentials

# Run database migrations and seed data
npm run db:seed

# This will:
# - Create all tables
# - Seed 100 investors
# - Create 50 deals
# - Generate 20 SPVs
# - Create sample investments
# - Set up admin user: admin@ownly.io / password123
```

### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend API will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## Default Login Credentials

### Admin Account
- **Email**: admin@ownly.io
- **Password**: password123

### Test Investor Accounts
All seeded investors have the password: `password123`

You can find investor emails in the database or create a new account via signup.

## Project Structure

```
ownly/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/         # Database & auth config
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, error handling
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main server file
│   ├── scripts/
│   │   └── seed.js         # Database seeding
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── app/                # Next.js 14 app directory
│   │   ├── page.tsx        # Marketplace (home)
│   │   ├── deals/[id]/     # Deal detail page
│   │   ├── portfolio/      # Investor portfolio
│   │   ├── login/          # Auth page
│   │   └── admin/          # Admin panel
│   ├── components/         # React components
│   ├── lib/                # API client & utilities
│   ├── types/              # TypeScript types
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile
- `POST /api/auth/impersonate` - Admin impersonate user

### Deals
- `GET /api/deals` - List all deals (with filters)
- `GET /api/deals/:id` - Get deal details
- `POST /api/deals` - Create deal (admin only)
- `PATCH /api/deals/:id` - Update deal (admin only)
- `POST /api/deals/:id/publish` - Publish deal (admin only)
- `POST /api/deals/:id/close` - Close deal (admin only)

### Investments
- `POST /api/investments` - Make investment
- `GET /api/investments/my-investments` - Get user's investments
- `GET /api/investments/:id` - Get investment details
- `POST /api/investments/:id/exit` - Request exit

### SPVs
- `GET /api/spvs/:id` - Get SPV details
- `GET /api/spvs/:id/cap-table` - Get cap table
- `POST /api/spvs/deal/:dealId` - Create SPV for deal (admin only)
- `PATCH /api/spvs/:id` - Update SPV (admin only)

## Common Issues & Solutions

### Database Connection Error
```
Error: Unable to connect to the database
```
**Solution**:
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `backend/.env`
- Ensure database exists: `psql -l | grep ownly_sandbox`

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**:
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`
- Or change the port in `backend/.env`: `PORT=5001`

### Frontend Can't Connect to Backend
```
Network Error / CORS Error
```
**Solution**:
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Verify CORS settings in `backend/src/server.js`

## Customization

### Change Seeded Data Amounts

Edit the seed script parameters:
```bash
# Seed with custom counts
cd backend
npm run db:seed -- --investors=200 --deals=100 --agents=50
```

### Add New Dummy Data

Edit `backend/src/utils/dataGenerator.js` to customize generated data:
- Deal titles and descriptions
- User names and locations
- Investment amounts
- Asset types

### Modify Deal Types

Edit `backend/src/models/Deal.js` to add new deal types:
```javascript
type: {
  type: DataTypes.ENUM('real_estate', 'franchise', 'startup', 'asset', 'your_new_type'),
  allowNull: false,
}
```

## Development Workflow

### Making Changes

1. **Backend changes**: Server auto-restarts with `nodemon`
2. **Frontend changes**: Hot reload enabled in Next.js dev mode
3. **Database schema changes**: Update models, then `npm run db:seed`

### Testing Features

1. **Create a deal**: Login as admin → Go to /admin → Create deal
2. **Invest in deal**: Login as investor → Browse deals → Click "Invest Now"
3. **View portfolio**: Login → Go to /portfolio

### Resetting Data

To reset all data and re-seed:
```bash
cd backend
npm run db:seed
```

This will drop all tables and recreate them with fresh dummy data.

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) (to be created).

Key considerations:
- Use environment-specific `.env` files
- Enable database migrations instead of sync
- Set up proper logging and monitoring
- Configure HTTPS and security headers
- Use a process manager (PM2)
- Set up database backups

## Support

For issues or questions:
- Check existing issues: [GitHub Issues](https://github.com/ownly/sandbox/issues)
- Documentation: See README.md
- Contact: dev@ownly.io

## License

Proprietary - OWNLY Platform © 2024
