-- PT Indo Agustus - Database Creation Script
-- Run this script to create both databases

-- Create Central Database (Jember)
CREATE DATABASE indoagustus_central_dev;

-- Create Branch Database (Bondowoso)
CREATE DATABASE indoagustus_branch_dev;

-- Verify databases created
\l

-- Instructions:
-- Run this script with: psql -U postgres -f create-databases.sql
