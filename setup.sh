#!/bin/bash

# PT Indo Agustus - Setup Script
# Script untuk memudahkan setup project untuk developer baru

set -e  # Exit on error

echo "🚀 PT Indo Agustus - Setup Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL command line tools not found${NC}"
    echo "Please make sure PostgreSQL is installed and running"
else
    echo -e "${GREEN}✅ PostgreSQL is installed${NC}"
fi

echo ""
echo "📥 Installing dependencies..."
npm install

echo ""
echo "📝 Setting up environment file..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env.local with your database credentials${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local already exists, skipping...${NC}"
fi

echo ""
echo "🔧 Generating Prisma Client..."
npm run db:generate

echo ""
echo "=================================="
echo -e "${GREEN}✅ Setup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your PostgreSQL credentials"
echo "2. Create databases:"
echo "   psql -U postgres -c \"CREATE DATABASE indoagustus_central_dev;\""
echo "   psql -U postgres -c \"CREATE DATABASE indoagustus_branch_dev;\""
echo "3. Run migrations:"
echo "   npx prisma migrate dev --name init"
echo "4. Seed database:"
echo "   npm run db:seed"
echo "5. Start server:"
echo "   npm run dev"
echo ""
echo "📖 For detailed setup guide, see SETUP.md"
echo ""
