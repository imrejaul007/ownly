# PostgreSQL Installation Guide for macOS

**Your System**: macOS (Apple Silicon/ARM64)
**Required**: PostgreSQL 14 or higher
**Estimated Time**: 5-10 minutes

---

## ✅ Recommended Method: Postgres.app (Easiest!)

Postgres.app is the easiest way to install PostgreSQL on macOS. It's a simple drag-and-drop application.

### Step 1: Download Postgres.app

1. Open your browser and go to: **https://postgresapp.com/**
2. Click **"Download"** (it will auto-detect your Apple Silicon Mac)
3. Wait for the download to complete (~150 MB)

### Step 2: Install

1. Open the downloaded file (Postgres-*.dmg)
2. Drag the **Postgres** icon to your **Applications** folder
3. Open **Applications** folder
4. Double-click **Postgres** to launch it
5. Click **"Initialize"** when prompted
6. PostgreSQL will start automatically!

### Step 3: Add to PATH (Important!)

Open Terminal and run:

```bash
# Add PostgreSQL to your PATH
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc

# Reload your shell configuration
source ~/.zshrc

# Verify installation
psql --version
```

You should see: `psql (PostgreSQL) 14.x` or higher

### Step 4: Create OWNLY Database

```bash
# Create the database
createdb ownly_sandbox

# Verify it was created
psql -l | grep ownly_sandbox
```

### Step 5: Setup Tables

```bash
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db
```

✅ **Done!** PostgreSQL is now ready for OWNLY.

---

## Alternative Method 1: Homebrew (If you want package manager)

If you prefer to use Homebrew, you'll need to install it first.

### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions. After installation, run:

```bash
# Add Homebrew to PATH (for Apple Silicon)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Install PostgreSQL via Homebrew

```bash
# Install PostgreSQL 14
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify it's running
pg_isready
```

### Create Database

```bash
# Create the database
createdb ownly_sandbox

# Setup tables
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db
```

---

## Alternative Method 2: Docker (If you prefer containers)

### Install Docker Desktop

1. Download Docker Desktop for Mac (Apple Silicon): https://www.docker.com/products/docker-desktop/
2. Install and launch Docker Desktop
3. Wait for Docker to start (whale icon in menu bar)

### Run PostgreSQL Container

```bash
# Create and start PostgreSQL container
docker run --name ownly-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ownly_sandbox \
  -p 5432:5432 \
  -d postgres:14

# Verify container is running
docker ps | grep ownly-postgres

# Test connection
docker exec -it ownly-postgres psql -U postgres -d ownly_sandbox
```

Type `\q` to exit psql.

### Setup Tables

```bash
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db
```

**To stop/start the container later**:
```bash
docker stop ownly-postgres
docker start ownly-postgres
```

---

## Verification Steps

After installation with any method, verify everything works:

### 1. Check PostgreSQL is Running

```bash
# Method depends on installation:

# Postgres.app: Check the elephant icon in menu bar (should be active)

# Homebrew:
brew services list | grep postgresql

# Docker:
docker ps | grep ownly-postgres
```

### 2. Test Database Connection

```bash
psql ownly_sandbox
```

You should see:
```
psql (14.x)
Type "help" for help.

ownly_sandbox=#
```

Type `\q` to exit.

### 3. Verify Tables Were Created

```bash
psql ownly_sandbox -c "\dt"
```

You should see a list of 26+ tables:
- users
- deals
- investments
- transactions
- spvs
- payment_methods
- webhooks
- email_templates
- workflows
- ... and more

### 4. Check Backend Connection

The backend should auto-restart and connect. Check logs:

```bash
# The backend terminal should show:
✅ Database connection established
✅ Database synchronized successfully
🚀 Server is running on http://localhost:5000
```

### 5. Test API

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T...",
  "database": "connected"
}
```

---

## Troubleshooting

### "psql: command not found"

**Problem**: PostgreSQL CLI tools not in PATH

**Solution (Postgres.app)**:
```bash
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Solution (Homebrew)**:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "connection to server on socket failed"

**Problem**: PostgreSQL is not running

**Solution (Postgres.app)**:
- Open Postgres.app
- Click "Start" if it's not already running
- Elephant icon in menu bar should be solid (not outline)

**Solution (Homebrew)**:
```bash
brew services start postgresql@14
```

**Solution (Docker)**:
```bash
docker start ownly-postgres
```

### "database does not exist"

**Problem**: Database not created

**Solution**:
```bash
createdb ownly_sandbox
```

### "relation does not exist" when running app

**Problem**: Tables not created

**Solution**:
```bash
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db
```

### "port 5432 already in use"

**Problem**: Another PostgreSQL instance is running

**Solution**:
```bash
# Find what's using port 5432
lsof -i :5432

# Stop all PostgreSQL services
brew services stop postgresql@14  # if using Homebrew
# or stop Postgres.app
# or docker stop ownly-postgres
```

---

## Which Method Should I Use?

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Postgres.app** | ✅ Easiest<br>✅ GUI interface<br>✅ No terminal needed<br>✅ Menu bar controls | ⚠️ Mac only | Beginners, quick setup |
| **Homebrew** | ✅ Package manager<br>✅ Easy updates<br>✅ CLI control | ⚠️ Requires Homebrew<br>⚠️ More setup | Developers who use Homebrew |
| **Docker** | ✅ Isolated<br>✅ Easy cleanup<br>✅ Multiple versions | ⚠️ Requires Docker<br>⚠️ More memory | Advanced users, containers |

**Recommendation**: **Use Postgres.app** - it's the fastest and easiest method!

---

## Next Steps After Installation

Once PostgreSQL is installed and running:

1. ✅ Database is running
2. ✅ Tables are created
3. ✅ Backend connects successfully

**Now you're ready to import data!**

```bash
cd /Users/rejaulkarim/Documents/ownly/backend
node src/scripts/importOwnlyData.js
```

See `DATA_IMPORT_GUIDE.md` for details.

---

## Quick Reference

**Start PostgreSQL**:
```bash
# Postgres.app: Open the app, click Start
# Homebrew: brew services start postgresql@14
# Docker: docker start ownly-postgres
```

**Stop PostgreSQL**:
```bash
# Postgres.app: Click Stop in menu bar
# Homebrew: brew services stop postgresql@14
# Docker: docker stop ownly-postgres
```

**Connect to Database**:
```bash
psql ownly_sandbox
```

**Create Database**:
```bash
createdb ownly_sandbox
```

**Setup Tables**:
```bash
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db
```

**Check if Running**:
```bash
pg_isready
```

---

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify your macOS version: `sw_vers`
3. Check PostgreSQL version: `psql --version`
4. Check backend logs: `tail -f /Users/rejaulkarim/Documents/ownly/backend/logs/combined.log`

---

**Recommended**: Download Postgres.app now from **https://postgresapp.com/** and follow the simple 5-step guide above!
