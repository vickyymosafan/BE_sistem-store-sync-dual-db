@echo off
REM Database Setup Script for Windows

echo ========================================
echo PT Indo Agustus - Database Setup
echo ========================================
echo.

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL command line tools not found
    echo Please install PostgreSQL or add it to PATH
    pause
    exit /b 1
)

echo Creating databases...
echo.

REM Prompt for PostgreSQL password
set /p PGPASSWORD="Enter PostgreSQL password for user 'postgres': "

REM Create databases
psql -U postgres -c "CREATE DATABASE indoagustus_central_dev;"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Created indoagustus_central_dev
) else (
    echo [WARNING] Database might already exist or error occurred
)

psql -U postgres -c "CREATE DATABASE indoagustus_branch_dev;"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Created indoagustus_branch_dev
) else (
    echo [WARNING] Database might already exist or error occurred
)

echo.
echo Verifying databases...
psql -U postgres -c "\l" | findstr indoagustus

echo.
echo ========================================
echo Database setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Run migrations: npx prisma migrate dev --name init
echo 2. Seed database: npm run db:seed
echo.
pause
