# Guide: Clear Database Data

## Overview
Ada 2 database terpisah dalam sistem ini:
- **indoagustus_central_dev** - Database Pusat Jember
- **indoagustus_branch_dev** - Database Cabang Bondowoso

## Files Available

### 1. clear-data.sql
Clear semua data dari database **PUSAT** (central)
- Menghapus: SyncLog, Sale, SaleItem, Inventory, Price, Product, Store

### 2. clear-data-branch.sql
Clear semua data dari database **CABANG** (branch)
- Menghapus: Sale, SaleItem, Inventory, Price, Product, Store
- Tidak menghapus SyncLog (karena ada di database pusat)

## How to Clear Branch Data

### Option 1: Using PowerShell (Recommended for Windows)
```powershell
cd backend
.\clear-branch-data.ps1
```

### Option 2: Using Batch File (Windows CMD)
```cmd
cd backend
clear-branch-data.bat
```

### Option 3: Using psql Command Line
```bash
cd backend
psql -U postgres -d indoagustus_branch_dev -f clear-data-branch.sql
# Password: Admin
```

### Option 4: Using pgAdmin
1. Open pgAdmin
2. Connect to PostgreSQL server (localhost:5433)
3. Select database: **indoagustus_branch_dev**
4. Open Query Tool
5. Open file: `clear-data-branch.sql`
6. Execute (F5)

### Option 5: Using DBeaver / DataGrip
1. Connect to database: **indoagustus_branch_dev**
2. Open SQL Editor
3. Open file: `clear-data-branch.sql`
4. Execute

## After Clearing Branch Data

1. **Refresh Browser**
   - Press `Ctrl + F5` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

2. **Re-sync Data from Central**
   - Go to "Cabang Bondowoso" section
   - Click "Produk & Harga" tab
   - Click "Sync dari Pusat" button
   - Wait for success message

3. **Verify Data**
   - Check that products and prices are displayed
   - Should match Master Harga in Pusat Jember

## Troubleshooting

### Problem: Data still appears after clearing
**Solution:**
1. Make sure you ran the script on the correct database (**indoagustus_branch_dev**)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+F5)
4. Check database connection in script

### Problem: "psql: command not found"
**Solution:**
1. Install PostgreSQL client tools
2. Or use pgAdmin / DBeaver instead

### Problem: "Permission denied"
**Solution:**
1. Make sure PostgreSQL is running
2. Check username/password in script
3. Verify database exists: `indoagustus_branch_dev`

## Database Connection Details

### Central Database
- Host: localhost
- Port: 5433
- Database: indoagustus_central_dev
- User: postgres
- Password: Admin

### Branch Database
- Host: localhost
- Port: 5433
- Database: indoagustus_branch_dev
- User: postgres
- Password: Admin

## Warning ⚠️

**IMPORTANT:** 
- Clearing data is **irreversible**
- Make sure you're clearing the correct database
- In production, always backup before clearing data
- These scripts are for **development only**

## Quick Reference

| Task | Database | Script |
|------|----------|--------|
| Clear pusat data | indoagustus_central_dev | clear-data.sql |
| Clear cabang data | indoagustus_branch_dev | clear-data-branch.sql |
| Clear cabang (auto) | indoagustus_branch_dev | clear-branch-data.ps1 or .bat |
