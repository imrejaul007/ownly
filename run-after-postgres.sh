#!/bin/bash

# Run this AFTER you've installed Postgres.app
# This script will setup everything else automatically

echo "🚀 Setting up OWNLY Platform..."
echo ""

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found in PATH"
    echo ""
    echo "If you installed Postgres.app, run this first:"
    echo "  echo 'export PATH=\"/Applications/Postgres.app/Contents/Versions/latest/bin:\$PATH\"' >> ~/.zshrc"
    echo "  source ~/.zshrc"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running"
    echo ""
    echo "Please:"
    echo "  1. Open Postgres.app"
    echo "  2. Click 'Start' if it's not already running"
    echo "  3. Wait for elephant icon to become solid"
    echo "  4. Run this script again"
    exit 1
fi

echo "✅ PostgreSQL is running!"
echo ""

# Create database
echo "📊 Creating database..."
if psql -lqt | cut -d \| -f 1 | grep -qw ownly_sandbox; then
    echo "✅ Database exists"
else
    createdb ownly_sandbox
    echo "✅ Database created"
fi

# Setup tables
echo ""
echo "🏗️  Creating tables (26 models)..."
cd /Users/rejaulkarim/Documents/ownly/backend
npm run setup:db

if [ $? -eq 0 ]; then
    echo "✅ Tables created"
else
    echo "❌ Table creation failed"
    exit 1
fi

# Import data
echo ""
echo "💾 Importing data..."
echo "   This will take ~30 seconds..."
node src/scripts/importOwnlyData.js

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "🎉 SUCCESS! Your platform is ready!"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    echo "✅ Database: Connected"
    echo "✅ Tables: 26 models created"
    echo "✅ Data: 2,100+ records imported"
    echo ""
    echo "🌐 Open: http://localhost:3002"
    echo ""
    echo "🔐 Login as showcase investor:"
    echo "   Email: ahmed.almansoori@example.ae"
    echo "   Password: investor123"
    echo ""
    echo "📊 You'll see:"
    echo "   • 8 investments (all 5 types)"
    echo "   • 282 monthly earning records"
    echo "   • 3 exit events with profits"
    echo "   • Complete portfolio journey"
    echo ""
    echo "The backend will restart automatically!"
    echo "Refresh your browser to see all data! 🚀"
    echo ""
else
    echo "❌ Import failed"
    exit 1
fi
