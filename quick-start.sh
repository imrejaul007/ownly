#!/bin/bash

# OWNLY Platform Quick Start Script
# Automates PostgreSQL installation and database setup

set -e  # Exit on error

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║    🚀 OWNLY Platform Quick Start Setup           ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is for macOS only"
    echo "For other systems, see INSTALL_POSTGRESQL.md"
    exit 1
fi

echo "System: macOS $(sw_vers -productVersion)"
echo ""

# Step 1: Check if PostgreSQL is already installed
print_step "Step 1/5: Checking PostgreSQL installation..."

if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    print_success "PostgreSQL is already installed (version $PSQL_VERSION)"

    # Check if it's running
    if pg_isready &> /dev/null; then
        print_success "PostgreSQL is running"
    else
        print_warning "PostgreSQL is installed but not running"

        # Try to start it
        if command -v brew &> /dev/null; then
            brew services start postgresql@14 &> /dev/null || brew services start postgresql &> /dev/null || true
        fi

        sleep 2

        if pg_isready &> /dev/null; then
            print_success "PostgreSQL started successfully"
        else
            print_error "Could not start PostgreSQL automatically"
            echo ""
            echo "Please start PostgreSQL manually:"
            echo "  - If using Postgres.app: Open the app and click Start"
            echo "  - If using Homebrew: brew services start postgresql@14"
            echo "  - If using Docker: docker start ownly-postgres"
            echo ""
            echo "Then run this script again."
            exit 1
        fi
    fi
else
    print_warning "PostgreSQL not found"
    echo ""
    echo "You have 3 options to install PostgreSQL:"
    echo ""
    echo "1. ${GREEN}Postgres.app${NC} (Recommended - Easiest)"
    echo "   Download from: https://postgresapp.com/"
    echo "   Then run this script again."
    echo ""
    echo "2. ${GREEN}Homebrew${NC} (For developers)"
    echo "   This script can install it for you if Homebrew is available."
    echo ""
    echo "3. ${GREEN}Docker${NC} (For container users)"
    echo "   See INSTALL_POSTGRESQL.md for Docker setup."
    echo ""

    # Check if Homebrew is available
    if command -v brew &> /dev/null; then
        echo "Homebrew detected! Would you like to install PostgreSQL via Homebrew? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_step "Installing PostgreSQL via Homebrew..."
            brew install postgresql@14

            print_step "Starting PostgreSQL service..."
            brew services start postgresql@14

            # Wait for PostgreSQL to start
            sleep 3

            if pg_isready &> /dev/null; then
                print_success "PostgreSQL installed and started successfully"
            else
                print_error "PostgreSQL installed but not running properly"
                exit 1
            fi
        else
            echo ""
            print_warning "Please install PostgreSQL manually and run this script again."
            exit 0
        fi
    else
        print_warning "Please install PostgreSQL using one of the methods above"
        print_warning "See INSTALL_POSTGRESQL.md for detailed instructions"
        exit 0
    fi
fi

echo ""

# Step 2: Create database
print_step "Step 2/5: Creating OWNLY database..."

if psql -lqt | cut -d \| -f 1 | grep -qw ownly_sandbox; then
    print_success "Database 'ownly_sandbox' already exists"
else
    createdb ownly_sandbox
    print_success "Database 'ownly_sandbox' created"
fi

echo ""

# Step 3: Setup database tables
print_step "Step 3/5: Setting up database tables..."

cd /Users/rejaulkarim/Documents/ownly/backend

if npm run setup:db > /tmp/ownly-setup.log 2>&1; then
    print_success "Database tables created successfully"
else
    print_error "Failed to create database tables"
    echo "Check logs: /tmp/ownly-setup.log"
    exit 1
fi

echo ""

# Step 4: Import sample data
print_step "Step 4/5: Importing sample data..."

echo "Would you like to import sample data? (y/n)"
echo "  - 15 Brands (investment opportunities)"
echo "  - 20 Investors with portfolios"
echo "  - 51 Investments"
echo "  - 1,801 Monthly transactions (36 months history)"
echo "  - 9 Exit events"
echo ""
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    if node src/scripts/importOwnlyData.js > /tmp/ownly-import.log 2>&1; then
        print_success "Sample data imported successfully"
        echo ""
        echo "📊 Platform now has realistic data:"
        echo "   - Total Invested: 2,476,000 AED"
        echo "   - Total ROI Distributed: 5,893,297 AED"
        echo "   - 9 Exit Events"
    else
        print_error "Failed to import sample data"
        echo "Check logs: /tmp/ownly-import.log"
        exit 1
    fi
else
    print_warning "Skipped data import (you can import later)"
fi

echo ""

# Step 5: Verify everything is working
print_step "Step 5/5: Verifying setup..."

# Check if backend can connect
sleep 2

if psql ownly_sandbox -c "SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
    print_success "Database connection verified"
else
    print_warning "Database created but connection test failed"
fi

# Check if frontend is accessible
if curl -s http://localhost:3002 > /dev/null 2>&1; then
    print_success "Frontend is running"
else
    print_warning "Frontend not accessible (may need to start it)"
fi

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║    ✅ OWNLY Platform Setup Complete!              ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

echo "${GREEN}🎉 Your OWNLY platform is ready!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. ${GREEN}Access the platform${NC}"
echo "   Frontend: http://localhost:3002"
echo "   Backend API: http://localhost:5000/api"
echo ""
echo "2. ${GREEN}Login credentials${NC}"
echo "   Admin: admin@ownly.ae / admin123"
echo "   Investors: Use any investor email / investor123"
echo ""
echo "3. ${GREEN}Test the features${NC}"
echo "   - Browse 15 investment opportunities"
echo "   - View investor portfolios"
echo "   - Check transaction history"
echo "   - Explore v1.6.0 features:"
echo "     • Payments: http://localhost:3002/settings/payments"
echo "     • Webhooks: http://localhost:3002/settings/webhooks"
echo "     • Emails: http://localhost:3002/settings/emails"
echo "     • Workflows: http://localhost:3002/settings/workflows"
echo ""
echo "4. ${GREEN}Documentation${NC}"
echo "   - READY_TO_IMPORT.md - Quick reference"
echo "   - DATA_IMPORT_GUIDE.md - Data import details"
echo "   - PROJECT_STATUS.md - Complete overview"
echo ""

# Check if backend is running
if ! lsof -ti:5000 > /dev/null 2>&1; then
    print_warning "Backend is not running. Start it with:"
    echo "   cd /Users/rejaulkarim/Documents/ownly/backend && npm run dev"
    echo ""
fi

# Check if frontend is running
if ! lsof -ti:3002 > /dev/null 2>&1; then
    print_warning "Frontend is not running. Start it with:"
    echo "   cd /Users/rejaulkarim/Documents/ownly/frontend && npm run dev"
    echo ""
fi

echo "${GREEN}Happy investing! 🚀${NC}"
echo ""
