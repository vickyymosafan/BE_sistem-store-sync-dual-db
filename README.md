# PT Indo Agustus - Sistem Replikasi Database

Sistem replikasi database dengan arsitektur pusat-cabang untuk manajemen retail. Fitur manajemen master data, sinkronisasi harga, pelacakan penjualan, dan konsistensi eventual antara toko pusat Jember dan cabang Bondowoso.

## 🚀 Fitur Utama

- **Replikasi Database** - Sinkronisasi data antara pusat dan cabang
- **Manajemen Master Data** - Kelola produk, harga, dan toko
- **Point of Sale** - Sistem kasir untuk transaksi penjualan
- **Manajemen Inventori** - Tracking stok barang per cabang
- **Sinkronisasi Harga** - Update harga dari pusat ke cabang
- **Eventual Consistency** - Konsistensi data dengan replikasi asinkron
- **Idempotency** - Mencegah duplikasi transaksi

## 🏗️ Arsitektur

```
┌─────────────────────┐         ┌─────────────────────┐
│   Database Pusat    │         │  Database Cabang    │
│   (Jember)          │◄───────►│  (Bondowoso)        │
│                     │  Sync   │                     │
│  - Master Data      │         │  - Local Data       │
│  - Harga            │         │  - Transaksi        │
│  - Laporan          │         │  - Inventori        │
└─────────────────────┘         └─────────────────────┘
```

## 🛠️ Teknologi

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (2 instances)
- **ORM:** Prisma
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Arsitektur:** Clean Architecture (3 layers)

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/vickyymosafan/BE_sistem-store-sync-dual-db.git
cd BE_sistem-store-sync-dual-db

# Install dependencies
cd backend
npm install

# Setup database
npm run prisma:migrate
npm run seed

# Start server
npm run dev
```

## 🔧 Konfigurasi

Edit file `backend/.env`:

```env
# Central Database (Pusat Jember)
DATABASE_URL_CENTRAL=postgresql://user:password@localhost:5433/indoagustus_central_dev

# Branch Database (Cabang Bondowoso)
DATABASE_URL_BRANCH_BONDOWOSO=postgresql://user:password@localhost:5433/indoagustus_branch_dev
```

## 📖 Dokumentasi

- [Dokumentasi UI](backend/UI-DOCUMENTATION.md)
- [Dokumentasi Lengkap](DOKUMENTASI-PT-INDOAGUSTUS.md)
- [Bugfix Master Harga](BUGFIX-PRODUCTS-WITHOUT-PRICE.md)
- [Clear Data Guide](backend/CLEAR-DATA-GUIDE.md)

## 🎯 Penggunaan

1. Buka browser: `http://localhost:3000/dashboard.html`
2. Navigasi ke section:
   - **Pusat Jember** - Manajemen master data dan laporan
   - **Cabang Bondowoso** - Operasional kasir dan transaksi
   - **Log Replikasi** - Monitoring sinkronisasi

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**vickymosafan**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by vickymosafan
