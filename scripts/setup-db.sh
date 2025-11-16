#!/bin/bash

# Database Setup Script for Linux/macOS

set -e

echo "🗄️  PT Indo Agustus - Database Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL command line tools not found${NC}"
    echo "Please install PostgreSQL or add it to PATH"
    exit 1
fi

echo "Creating databases..."
echo ""

# Prompt for PostgreSQL user (default: postgres)
read -p "Enter PostgreSQL username [postgres]: " PGUSER
PGUSER=${PGUSER:-postgres}

# Create central database
echo "Creating indoagustus_central_dev..."
if psql -U "$PGUSER" -c "CREATE DATABASE indoagustus_central_dev;" 2>/dev/null; then
    echo -e "${GREEN}✅ Created indoagustus_central_dev${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist${NC}"
fi

# Create branch database
echo "Creating indoagustus_branch_dev..."
if psql -U "$PGUSER" -c "CREATE DATABASE indoagustus_branch_dev;" 2>/dev/null; then
    echo -e "${GREEN}✅ Created indoagustus_branch_dev${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist${NC}"
fi

echo ""
echo "Verifying databases..."
psql -U "$PGUSER" -c "\l" | grep indoagustus

echo ""
echo "===================================="
echo -e "${GREEN}✅ Database setup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Run migrations: npx prisma migrate dev --name init"
echo "2. Seed database: npm run db:seed"
echo ""
