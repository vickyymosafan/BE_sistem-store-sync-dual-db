# Setup Guide - PT Indo Agustus

Panduan lengkap instalasi dan konfigurasi sistem untuk developer baru.

## 📋 Prerequisites

### 1. Install Node.js

**Windows:**
- Download dari [nodejs.org](https://nodejs.org/)
- Pilih versi LTS (Long Term Support)
- Jalankan installer dan ikuti instruksi
- Verifikasi instalasi:
  ```bash
  node --version  # Harus >= 18.x
  npm --version
  ```

**macOS:**
```bash
# Menggunakan Homebrew
brew install node

# Atau download dari nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PostgreSQL

**Windows:**
- Download dari [postgresql.org](https://www.postgresql.org/download/windows/)
- Jalankan installer
- Catat password untuk user `postgres`
- Default port: 5432

**macOS:**
```bash
# Menggunakan Homebrew
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Install Git

**Windows:**
- Download dari [git-scm.com](https://git-scm.com/)

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

## 🚀 Instalasi Step-by-Step

### Step 1: Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/vickyymosafan/BE_sistem-store-sync-dual-db.git

# Masuk ke folder project
cd BE_sistem-store-sync-dual-db/backend
```

### Step 2: Install Dependencies

```bash
# Install semua dependencies
npm install
```

**Troubleshooting:**
- Jika error `EACCES`, gunakan: `sudo npm install` (Linux/macOS)
- Jika error network, coba: `npm install --registry=https://registry.npmjs.org/`

### Step 3: Setup PostgreSQL Database

#### A. Login ke PostgreSQL

**Windows (pgAdmin):**
1. Buka pgAdmin 4
2. Connect ke server PostgreSQL
3. Klik kanan pada "Databases" → Create → Database

**Command Line (semua OS):**
```bash
# Login sebagai postgres user
psql -U postgres

# Atau di Linux:
sudo -u postgres psql
```

#### B. Buat Database

Jalankan SQL berikut di PostgreSQL:

```sql
-- Database untuk Pusat (Jember)
CREATE DATABASE indoagustus_central_dev;

-- Database untuk Cabang (Bondowoso)
CREATE DATABASE indoagustus_branch_dev;

-- Verifikasi database sudah dibuat
\l

-- Keluar dari psql
\q
```

#### C. Test Koneksi

```bash
# Test koneksi ke central database
psql -U postgres -d indoagustus_central_dev -c "SELECT version();"

# Test koneksi ke branch database
psql -U postgres -d indoagustus_branch_dev -c "SELECT version();"
```

### Step 4: Konfigurasi Environment

#### A. Copy File Environment

```bash
# Di folder backend/
cp .env.example .env.local
```

#### B. Edit .env.local

Buka file `.env.local` dengan text editor dan sesuaikan:

```env
NODE_ENV=development
PORT=3000

# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME

# Contoh dengan default PostgreSQL:
DATABASE_URL_CENTRAL=postgresql://postgres:postgres@localhost:5432/indoagustus_central_dev
DATABASE_URL_BRANCH_BONDOWOSO=postgresql://postgres:postgres@localhost:5432/indoagustus_branch_dev
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/indoagustus_central_dev
```

**Sesuaikan dengan konfigurasi Anda:**
- `USERNAME`: Default `postgres`
- `PASSWORD`: Password yang Anda set saat install PostgreSQL
- `HOST`: Default `localhost`
- `PORT`: Default `5432`

**Contoh konfigurasi lain:**
```env
# Jika password Anda adalah "admin123"
DATABASE_URL_CENTRAL=postgresql://postgres:admin123@localhost:5432/indoagustus_central_dev

# Jika PostgreSQL di port 5433
DATABASE_URL_CENTRAL=postgresql://postgres:admin123@localhost:5433/indoagustus_central_dev
```

### Step 5: Generate Prisma Client

```bash
npm run db:generate
```

Output yang diharapkan:
```
✔ Generated Prisma Client
```

### Step 6: Jalankan Database Migration

#### A. Migrate Central Database

```bash
# Pastikan DATABASE_URL di .env.local mengarah ke central database
npx prisma migrate dev --name init
```

Output yang diharapkan:
```
✔ Database migrations applied successfully
```

#### B. Migrate Branch Database

**Cara 1: Edit .env.local sementara**
```bash
# 1. Edit .env.local, ubah DATABASE_URL ke branch database:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/indoagustus_branch_dev

# 2. Jalankan migration
npx prisma migrate dev --name init

# 3. Kembalikan DATABASE_URL ke central database
```

**Cara 2: Gunakan environment variable inline (Linux/macOS)**
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/indoagustus_branch_dev" npx prisma migrate dev --name init
```

**Cara 3: Gunakan db push (lebih mudah)**
```bash
# Push schema ke branch database tanpa migration history
DATABASE_URL="postgresql://postgres:password@localhost:5432/indoagustus_branch_dev" npx prisma db push
```

### Step 7: Seed Data Awal

```bash
npm run db:seed
```

Output yang diharapkan:
```
✅ Seeding completed successfully!
📊 Summary:
  - 2 stores created
  - 10 products created
  - 20 prices created
  - 10 inventory records created
```

### Step 8: Jalankan Aplikasi

```bash
npm run dev
```

Output yang diharapkan:
```
[nodemon] starting `ts-node src/index.ts`
🚀 Server running on http://localhost:3000
✅ Connected to Central Database
✅ Connected to Branch Database
```

### Step 9: Test Aplikasi

Buka browser dan akses:
```
http://localhost:3000/dashboard.html
```

Anda akan melihat dashboard dengan 3 section:
1. **Pusat Jember** - Manajemen master data
2. **Cabang Bondowoso** - Operasional kasir
3. **Log Replikasi** - Monitoring sinkronisasi

## ✅ Verifikasi Setup

### 1. Cek Database

```bash
# Buka Prisma Studio untuk central database
npx prisma studio

# Atau gunakan psql
psql -U postgres -d indoagustus_central_dev
```

Di psql, jalankan:
```sql
-- Cek tabel yang sudah dibuat
\dt

-- Cek data stores
SELECT * FROM "Store";

-- Cek data products
SELECT * FROM "Product";
```

### 2. Test API Endpoints

**Test dengan curl:**
```bash
# List stores
curl http://localhost:3000/api/admin/stores

# List products
curl http://localhost:3000/api/central/products

# List prices
curl http://localhost:3000/api/central/prices
```

**Test dengan browser:**
- `http://localhost:3000/api/admin/stores`
- `http://localhost:3000/api/central/products`

### 3. Test Sinkronisasi

1. Buka dashboard: `http://localhost:3000/dashboard.html`
2. Di section **Cabang Bondowoso**, klik "⬇️ Sync dari Pusat"
3. Cek console browser (F12) untuk melihat response
4. Buat transaksi dummy di kasir
5. Klik "⬆️ Kirim ke Pusat"
6. Cek section **Log Replikasi** untuk melihat history

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solusi:**
```bash
npm run db:generate
```

### Error: "P1001: Can't reach database server"

**Penyebab:**
- PostgreSQL tidak running
- Kredensial salah
- Port salah

**Solusi:**
```bash
# Cek status PostgreSQL
# Windows (Services)
services.msc  # Cari "postgresql"

# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Start PostgreSQL jika belum running
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Error: "P1003: Database does not exist"

**Solusi:**
```bash
# Buat database manual
psql -U postgres -c "CREATE DATABASE indoagustus_central_dev;"
psql -U postgres -c "CREATE DATABASE indoagustus_branch_dev;"
```

### Error: "P3009: migrate.lock file is missing"

**Solusi:**
```bash
# Hapus folder migrations dan migrate ulang
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### Error: Port 3000 already in use

**Solusi:**
```bash
# Ubah port di .env.local
PORT=3001

# Atau kill process yang menggunakan port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

### Error: "EACCES: permission denied"

**Solusi (Linux/macOS):**
```bash
# Ubah ownership folder
sudo chown -R $USER:$USER .

# Atau install dengan sudo
sudo npm install
```

## 🔄 Reset Database (Jika Perlu)

Jika ingin reset database dan mulai dari awal:

```bash
# Reset central database
npx prisma migrate reset

# Ubah DATABASE_URL ke branch, lalu reset
npx prisma migrate reset

# Seed ulang
npm run db:seed
```

## 📚 Next Steps

Setelah setup berhasil:

1. Baca [README.md](README.md) untuk overview project
2. Baca [DOKUMENTASI-PT-INDOAGUSTUS.md](DOKUMENTASI-PT-INDOAGUSTUS.md) untuk detail arsitektur
3. Explore code di `src/`
4. Coba fitur-fitur di dashboard
5. Baca steering rules di `../.kiro/steering/` untuk development guidelines

## 💡 Tips Development

1. **Gunakan Prisma Studio** untuk explore database:
   ```bash
   npx prisma studio
   ```

2. **Watch mode untuk auto-reload**:
   ```bash
   npm run dev  # Sudah include nodemon
   ```

3. **Format code sebelum commit**:
   ```bash
   npm run format
   npm run lint:fix
   ```

4. **Backup database**:
   ```bash
   pg_dump -U postgres indoagustus_central_dev > backup.sql
   ```

## 🆘 Butuh Bantuan?

- Buka issue di GitHub
- Cek dokumentasi lengkap di folder ini
- Contact: vickymosafan

---

Happy Coding! 🚀
