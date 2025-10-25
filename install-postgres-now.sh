#!/bin/bash

# One-Command PostgreSQL Installer for OWNLY
# Downloads and sets up Postgres.app automatically

set -e

echo ""
echo "🚀 Installing PostgreSQL for OWNLY Platform..."
echo ""

# Check if already installed
if command -v psql &> /dev/null && pg_isready &> /dev/null 2>&1; then
    echo "✅ PostgreSQL is already installed and running!"
    echo ""
    read -p "Continue with database setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    echo "📥 PostgreSQL not found. Opening Postgres.app download page..."
    echo ""
    echo "Please follow these simple steps:"
    echo ""
    echo "1. Download Postgres.app from the page that will open"
    echo "2. Drag Postgres.app to your Applications folder"
    echo "3. Open Postgres.app"
    echo "4. Click 'Initialize' in the app"
    echo "5. Come back here and press Enter"
    echo ""

    # Open download page
    open "https://postgresapp.com/downloads.html"

    echo "Press Enter when Postgres.app is installed and running..."
    read

    #Add to PATH
    echo ""
    echo "📝 Adding PostgreSQL to your PATH..."
    if [[ -d "/Applications/Postgres.app" ]]; then
        echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
        export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
        echo "✅ PATH updated"
    else
        echo "⚠️  Postgres.app not found in Applications. Please add to PATH manually:"
        echo '   export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"'
        exit 1
    fi

    # Verify installation
    if ! command -v psql &> /dev/null; then
        echo "❌ PostgreSQL command not found. Please restart your terminal and try again."
        exit 1
    fi
fi

echo ""
echo "✅ PostgreSQL is ready!"
echo ""

# Create database
echo "📊 Creating ownly_sandbox database..."
if psql -lqt | cut -d \| -f 1 | grep -qw ownly_sandbox; then
    echo "✅ Database already exists"
else
    createdb ownly_sandbox 2>/dev/null && echo "✅ Database created" || echo "⚠️  Could not create database (may need to restart terminal)"
fi

# Setup tables
echo ""
echo "🏗️  Setting up database tables..."
cd /Users/rejaulkarim/Documents/ownly/backend
if npm run setup:db > /tmp/ownly-setup.log 2>&1; then
    echo "✅ Tables created successfully"
else
    echo "❌ Table creation failed. Check: /tmp/ownly-setup.log"
    exit 1
fi

# Import data
echo ""
echo "💾 Importing sample data..."
echo "   - 15 Brands"
echo "   - 20 Investors"
echo "   - 51 Investments"
echo "   - 1,801 Transactions"
echo ""

if node src/scripts/importOwnlyData.js > /tmp/ownly-import.log 2>&1; then
    echo "✅ Data imported successfully!"
else
    echo "❌ Import failed. Check: /tmp/ownly-import.log"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎉 OWNLY Platform is Ready!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✅ Database: Connected"
echo "✅ Tables: Created (26 models)"
echo "✅ Data: Imported (~2,100 records)"
echo ""
echo "🌐 Access your platform:"
echo "   Frontend: http://localhost:3002"
echo "   Backend API: http://localhost:5000/api"
echo ""
echo "🔐 Login:"
echo "   Admin: admin@ownly.ae / admin123"
echo "   Investor: ahmed.almansoori@example.ae / investor123"
echo ""
echo "The backend will restart automatically and connect to the database."
echo "Refresh your browser to see all the data!"
echo ""
echo "Happy investing! 🚀"
echo ""
