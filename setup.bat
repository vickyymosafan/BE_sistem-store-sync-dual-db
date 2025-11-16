@echo off
REM PT Indo Agustus - Setup Script for Windows
REM Script untuk memudahkan setup project untuk developer baru

echo ========================================
echo PT Indo Agustus - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)
echo [OK] npm is installed
npm --version

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL command line tools not found
    echo Please make sure PostgreSQL is installed and running
) else (
    echo [OK] PostgreSQL is installed
)

echo.
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Setting up environment file...
if not exist .env.local (
    copy .env.example .env.local
    echo [OK] Created .env.local
    echo [WARNING] Please edit .env.local with your database credentials
) else (
    echo [WARNING] .env.local already exists, skipping...
)

echo.
echo Generating Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env.local with your PostgreSQL credentials
echo 2. Create databases in PostgreSQL:
echo    - Open pgAdmin or psql
echo    - CREATE DATABASE indoagustus_central_dev;
echo    - CREATE DATABASE indoagustus_branch_dev;
echo 3. Run migrations:
echo    npx prisma migrate dev --name init
echo 4. Seed database:
echo    npm run db:seed
echo 5. Start server:
echo    npm run dev
echo.
echo For detailed setup guide, see SETUP.md
echo.
pause
