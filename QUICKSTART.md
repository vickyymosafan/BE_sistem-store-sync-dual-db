# Quick Start Guide

Panduan cepat untuk menjalankan project dalam 5 menit! ⚡

## Prerequisites

✅ Node.js >= 18.x  
✅ PostgreSQL >= 14.x  
✅ Git

## 🚀 Setup dalam 5 Langkah

### 1️⃣ Clone & Install (1 menit)

```bash
git clone https://github.com/vickyymosafan/BE_sistem-store-sync-dual-db.git
cd BE_sistem-store-sync-dual-db/backend
npm install
```

### 2️⃣ Setup Environment (30 detik)

```bash
# Copy file environment
cp .env.example .env.local

# Edit .env.local - ganti dengan kredensial PostgreSQL Anda
# DATABASE_URL_CENTRAL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/indoagustus_central_dev
# DATABASE_URL_BRANCH_BONDOWOSO=postgresql://postgres:YOUR_PASSWORD@localhost:5432/indoagustus_branch_dev
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/indoagustus_central_dev
```

### 3️⃣ Buat Database (1 menit)

**Option A - Otomatis:**
```bash
# Windows
cd scripts
setup-db.bat

# Linux/macOS
bash scripts/setup-db.sh
```

**Option B - Manual:**
```bash
psql -U postgres
```
```sql
CREATE DATABASE indoagustus_central_dev;
CREATE DATABASE indoagustus_branch_dev;
\q
```

### 4️⃣ Setup Database Schema (1 menit)

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npx prisma migrate dev --name init

# Seed data
npm run db:seed
```

### 5️⃣ Jalankan Server (10 detik)

```bash
npm run dev
```

Buka browser: **http://localhost:3000/dashboard.html** 🎉

## ✅ Verifikasi

Jika berhasil, Anda akan melihat:

```
🚀 Server running on http://localhost:3000
✅ Connected to Central Database
✅ Connected to Branch Database
```

## 🎯 Test Fitur

1. **Lihat Produk**: Buka section "Pusat Jember" → List Produk
2. **Sync Harga**: Di section "Cabang Bondowoso" → Klik "⬇️ Sync dari Pusat"
3. **Buat Transaksi**: Di section "Cabang Bondowoso" → Tambah transaksi
4. **Sync Transaksi**: Klik "⬆️ Kirim ke Pusat"
5. **Lihat Log**: Buka section "Log Replikasi"

## 🐛 Troubleshooting Cepat

### Error: Cannot connect to database
```bash
# Cek PostgreSQL running
# Windows: services.msc → cari "postgresql"
# Linux: sudo systemctl status postgresql
# macOS: brew services list
```

### Error: Database does not exist
```bash
# Buat database manual
psql -U postgres -c "CREATE DATABASE indoagustus_central_dev;"
psql -U postgres -c "CREATE DATABASE indoagustus_branch_dev;"
```

### Error: Port 3000 already in use
```bash
# Edit .env.local, ubah PORT=3001
```

### Error: Prisma Client not generated
```bash
npm run db:generate
```

## 📚 Next Steps

- 📖 Baca [README.md](README.md) untuk overview lengkap
- 🔧 Baca [SETUP.md](SETUP.md) untuk troubleshooting detail
- 💻 Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk development guide
- 📂 Explore code di `src/`

## 🆘 Butuh Bantuan?

- Lihat [SETUP.md](SETUP.md) untuk panduan lengkap
- Buka issue di GitHub
- Contact: vickymosafan

---

Happy Coding! 🚀
