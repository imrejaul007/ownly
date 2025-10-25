# 🚀 Install PostgreSQL - 3 Minute Guide

## The Absolute Simplest Way

### Option 1: Postgres.app (Easiest - 3 clicks!)

1. **Download** (1 click):
   - Open this link: https://postgresapp.com/downloads.html
   - Click the big blue "Download" button
   - Wait ~30 seconds for download

2. **Install** (1 drag):
   - Open the downloaded .dmg file
   - Drag Postgres icon to Applications folder

3. **Start** (1 click):
   - Open Applications folder
   - Double-click Postgres app
   - Click "Initialize" button
   - Done! (elephant icon appears in menu bar)

4. **Add to Terminal**:
   ```bash
   echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

5. **Run Setup** (copy-paste this):
   ```bash
   createdb ownly_sandbox && cd /Users/rejaulkarim/Documents/ownly/backend && npm run setup:db && node src/scripts/importOwnlyData.js
   ```

**Total Time**: 3 minutes

---

### Option 2: One-Line Installer (If you have admin rights)

If you're comfortable with terminal, paste this ONE LINE:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install postgresql@14 && brew services start postgresql@14 && createdb ownly_sandbox && cd /Users/rejaulkarim/Documents/ownly/backend && npm run setup:db && node src/scripts/importOwnlyData.js
```

This will:
- Install Homebrew
- Install PostgreSQL
- Start PostgreSQL
- Create database
- Setup tables
- Import all data

**Total Time**: 5 minutes (mostly downloading)

---

## After Installation

### Verify It Worked

```bash
psql ownly_sandbox -c "SELECT COUNT(*) FROM deals;"
```

Should show: **15**

### Access Your Platform

1. **Frontend**: http://localhost:3002
2. **Login**: ahmed.almansoori@example.ae / investor123
3. **See**: All 8 investments, 282 transactions, 3 exits!

---

## Troubleshooting

### "psql: command not found"

**Postgres.app users**:
```bash
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Homebrew users**:
```bash
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "database does not exist"

```bash
createdb ownly_sandbox
```

### Backend not starting

Check the backend terminal - it should auto-restart once PostgreSQL is running.

---

## Need Help?

Open your terminal and paste:

```bash
cat /Users/rejaulkarim/Documents/ownly/YOUR_SHOWCASE_READY.txt
```

This shows what you'll see after installation!

---

**Recommendation**: Use Option 1 (Postgres.app) - it's the fastest and simplest!
