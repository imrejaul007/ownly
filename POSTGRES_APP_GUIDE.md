# 📱 Postgres.app - Complete Step-by-Step Guide

## Step 1: Download Postgres.app

1. **Open your web browser** (Safari, Chrome, etc.)

2. **Go to this website**:
   ```
   https://postgresapp.com/downloads.html
   ```

3. **You'll see a page with a big blue button** that says:
   ```
   Download Postgres.app with PostgreSQL 16, 15, 14, 13, 12
   ```

4. **Click the blue "Download" button**
   - The file will download (it's about 150 MB)
   - Wait for download to complete (~1-2 minutes)

---

## Step 2: Install Postgres.app

1. **Find the downloaded file**:
   - Look in your Downloads folder
   - Or click the download in your browser's download bar
   - File name will be: `Postgres-*.dmg`

2. **Double-click the .dmg file to open it**
   - A window will open showing the Postgres app icon

3. **Drag the Postgres icon to Applications**:
   - You'll see two things in the window:
     - A Postgres elephant icon (blue/gray)
     - An "Applications" folder shortcut
   - **Click and hold** the Postgres icon
   - **Drag it** onto the Applications folder
   - **Release** the mouse button
   - Wait for copy to complete (~10 seconds)

4. **Eject the disk image**:
   - Right-click on "Postgres" in Finder sidebar
   - Click "Eject"

---

## Step 3: Open Postgres.app

1. **Open Finder**

2. **Go to Applications folder**:
   - Press: `Command + Shift + A`
   - Or: Click "Applications" in Finder sidebar

3. **Find Postgres in Applications**:
   - Scroll down to find "Postgres" (blue elephant icon)
   - It should be alphabetically listed

4. **Double-click Postgres to open it**

5. **If you see a security warning**:
   ```
   "Postgres" cannot be opened because it is from an unidentified developer
   ```

   **Do this**:
   - Click "OK" to dismiss the warning
   - Right-click (or Control+click) on Postgres icon
   - Click "Open" from the menu
   - Click "Open" again in the dialog
   - This only happens the first time

---

## Step 4: Initialize PostgreSQL

1. **When Postgres.app opens**, you'll see a window with:
   - A list of PostgreSQL servers (probably empty at first)
   - A big blue button that says **"Initialize"**

2. **Click the "Initialize" button**
   - This creates the default PostgreSQL server
   - Wait ~5-10 seconds

3. **Success! You'll now see**:
   - A server listed with version "14" or "15" or "16"
   - Status showing as "Running" (green dot)
   - Port: 5432

4. **Look at your menu bar** (top-right of screen):
   - You should see a **gray elephant icon**
   - This means PostgreSQL is running!

---

## Step 5: Add PostgreSQL to Terminal

1. **Open Terminal**:
   - Press: `Command + Space`
   - Type: `terminal`
   - Press: `Enter`

2. **Copy and paste this command** (all as one line):
   ```bash
   echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
   ```
   - Press `Enter`

3. **Then run this**:
   ```bash
   source ~/.zshrc
   ```
   - Press `Enter`

4. **Verify it worked**:
   ```bash
   psql --version
   ```
   - You should see: `psql (PostgreSQL) 14.x` or similar
   - If you see this, **SUCCESS!**

---

## Step 6: Setup OWNLY Database

Now run my automated setup script!

**Copy and paste this entire command**:

```bash
/Users/rejaulkarim/Documents/ownly/run-after-postgres.sh
```

Press `Enter`

**What will happen**:
1. ✅ Creates `ownly_sandbox` database
2. ✅ Creates 26 database tables
3. ✅ Imports 15 brands
4. ✅ Imports 20 investors
5. ✅ Imports 52 investments
6. ✅ Imports 1,834 transactions
7. ✅ Creates 15 SPVs

**This takes ~30 seconds**

---

## Step 7: Access Your Platform!

1. **Open your browser**

2. **Go to**: http://localhost:3002

3. **Login with**:
   ```
   Email: ahmed.almansoori@example.ae
   Password: investor123
   ```

4. **Explore**:
   - Click "Portfolio" → See 8 investments
   - Click "Transactions" → See 282 monthly records
   - Click any investment → See 36-month history
   - See exit events with profits!

---

## 🎯 Visual Guide

### What Postgres.app Looks Like:

**After Initialize:**
```
┌─────────────────────────────────────────┐
│ Postgres                           ⚙️ 🗑️│
├─────────────────────────────────────────┤
│                                         │
│ Servers                                 │
│ ┌─────────────────────────────────────┐│
│ │ ● PostgreSQL 14                     ││
│ │   Port: 5432                        ││
│ │   Status: Running                   ││
│ └─────────────────────────────────────┘│
│                                         │
│ [Start Server] [Stop Server]           │
└─────────────────────────────────────────┘
```

**Menu Bar Icon:**
```
🍎 🔍 🖥️ 🔋 📶 [🐘] 🕐
                 ↑
         This is Postgres!
         (Solid = Running)
```

---

## Troubleshooting

### "Initialize" button doesn't work

1. Click "Remove Server" if there's an old one
2. Click "+" to add new server
3. Click "Initialize" again

### Can't find Postgres in Applications

1. Re-download from: https://postgresapp.com/
2. Make sure you dragged it to Applications folder
3. Check both main Applications and your user's Applications

### "psql: command not found" after adding to PATH

1. **Close and reopen Terminal** (important!)
2. Or run: `source ~/.zshrc`
3. Try `psql --version` again

### Elephant icon is hollow/not solid

- Click the elephant icon
- Click "Open Postgres"
- Click "Start Server"

### My script says "PostgreSQL not running"

1. Open Postgres.app
2. Make sure server status shows "Running"
3. Click "Start Server" if it's stopped
4. Wait 5 seconds
5. Run script again

---

## Important Notes

### Keep Postgres.app Running

- Don't quit Postgres.app while using your platform
- The elephant icon should stay in your menu bar
- If you quit it, your platform won't have data

### Starting After Reboot

If you restart your Mac:
1. Open Postgres.app again
2. It will auto-start the server
3. Your data is safe and will still be there!

### Stopping PostgreSQL

Only if you need to:
1. Click elephant icon in menu bar
2. Click "Quit Postgres"

Or:
1. Open Postgres.app window
2. Click "Stop Server"

---

## Quick Reference

### Starting PostgreSQL:
1. Open Applications
2. Double-click Postgres
3. Server starts automatically

### Check if Running:
```bash
pg_isready
```
Should show: "accepting connections"

### Create Database (if needed):
```bash
createdb ownly_sandbox
```

### Connect to Database:
```bash
psql ownly_sandbox
```
Type `\q` to exit

---

## Next Steps After Setup

1. **Visit**: http://localhost:3002
2. **Login**: ahmed.almansoori@example.ae / investor123
3. **Explore**:
   - Portfolio → 8 investments
   - Transactions → 282 records
   - Each investment details
   - Exit events

4. **Try other investors**:
   - Any email from the 20 investors
   - Password is always: `investor123`

5. **Admin access**:
   - Email: admin@ownly.ae
   - Password: admin123

---

## Summary

✅ **Download**: Postgres.app from website
✅ **Install**: Drag to Applications
✅ **Open**: Double-click Postgres app
✅ **Initialize**: Click the blue button
✅ **Setup**: Run my script
✅ **Login**: ahmed.almansoori@example.ae / investor123

**Total time**: 5 minutes
**Result**: Full platform with all data!

---

## Need Help?

If you get stuck at any step:
1. Take a screenshot
2. Tell me which step you're on
3. I'll help you through it!

You can do this! 🚀
