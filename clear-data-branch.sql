-- ============================================
-- Clear data from BRANCH database (Cabang Bondowoso)
-- ============================================
-- IMPORTANT: Connect to database 'indoagustus_branch_dev' before running this script!
-- 
-- How to run:
-- 1. Open pgAdmin or psql
-- 2. Connect to database: indoagustus_branch_dev
-- 3. Run this script
-- 
-- Or via command line:
-- psql -U postgres -d indoagustus_branch_dev -f clear-data-branch.sql
-- ============================================

-- Clear transactional data (sales and inventory)
TRUNCATE TABLE "SaleItem" CASCADE;
TRUNCATE TABLE "Sale" CASCADE;
TRUNCATE TABLE "Inventory" CASCADE;

-- Clear synced data (will be re-synced from central)
TRUNCATE TABLE "Price" CASCADE;
TRUNCATE TABLE "Product" CASCADE;
TRUNCATE TABLE "Store" CASCADE;

-- Verify data is cleared
SELECT 'SaleItem count: ' || COUNT(*) FROM "SaleItem";
SELECT 'Sale count: ' || COUNT(*) FROM "Sale";
SELECT 'Inventory count: ' || COUNT(*) FROM "Inventory";
SELECT 'Price count: ' || COUNT(*) FROM "Price";
SELECT 'Product count: ' || COUNT(*) FROM "Product";
SELECT 'Store count: ' || COUNT(*) FROM "Store";

-- Note: After running this script, you need to:
-- 1. Refresh browser (Ctrl+F5 or Cmd+Shift+R)
-- 2. Go to "Produk & Harga" page in Cabang Bondowoso
-- 3. Click "Sync dari Pusat" to re-sync products and prices
