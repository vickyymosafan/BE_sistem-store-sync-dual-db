# PT Indoagustus Backend

Backend system untuk PT Indoagustus, perusahaan ritel minimarket dengan kantor pusat di Jember dan cabang di Bondowoso. Dibangun dengan Express.js, TypeScript, Prisma ORM, dan PostgreSQL.

## Tech Stack

- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js
- **ORM**: Prisma dengan Accelerate
- **Database**: PostgreSQL (2 instances terpisah)
- **Deployment**: Vercel Serverless Functions
- **Validation**: Zod

## Architecture

System menggunakan arsitektur clean architecture dengan tiga layer:
- **HTTP Layer**: Routes, handlers, middleware, validation
- **Domain Layer**: Use cases, entities, repository interfaces
- **Infrastructure Layer**: Prisma repositories, database clients, mappers

System mengelola dua database PostgreSQL terpisah:
- **Central Database**: Database pusat Jember untuk master data dan agregasi
- **Branch Database**: Database cabang Bondowoso untuk operasi kasir lokal

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm atau yarn

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi database lokal Anda:

```env
NODE_ENV=development
PORT=3000

# Central Database (Jember)
DATABASE_URL_CENTRAL=postgresql://postgres:postgres@localhost:5432/indoagustus_central_dev

# Branch Database (Bondowoso)
DATABASE_URL_BRANCH_BONDOWOSO=postgresql://postgres:postgres@localhost:5433/indoagustus_branch_dev

# For Prisma migrations
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/indoagustus_central_dev
```

### 3. Setup Databases

Create two PostgreSQL databases:

```bash
# Central database
createdb indoagustus_central_dev

# Branch database  
createdb indoagustus_branch_dev
```

### 4. Run Migrations

```bash
npx prisma migrate dev
```

### 5. Seed Database (Optional)

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Admin Interface

Buka browser dan akses `http://localhost:3000` untuk mengakses admin interface.

Interface ini menyediakan:
- **Database Selector**: Switch antara Central (Jember) dan Branch (Bondowoso)
- **Table Tabs**: Akses semua tabel (Stores, Products, Prices, Inventory, Sales, Sale Items, Sync Logs)
- **Real-time Data**: Data langsung dari database tanpa cache
- **Responsive Design**: Tampilan yang clean dan mudah dibaca

### Admin API Endpoints

**GET /admin/tables/:database/:table**
- Mengambil data dari tabel tertentu
- Parameters:
  - `database`: "central" atau "branch"
  - `table`: "stores", "products", "prices", "inventory", "sales", "saleItems", "syncLogs"
- Response: Array of table records

Contoh:
```bash
curl http://localhost:3000/admin/tables/central/stores
curl http://localhost:3000/admin/tables/branch/inventory
```

## Deployment to Vercel

### 1. Setup Prisma Accelerate

1. Buat akun di [Prisma Data Platform](https://cloud.prisma.io/)
2. Create two Accelerate projects:
   - Central Database (Jember)
   - Branch Database (Bondowoso)
3. Dapatkan connection strings untuk masing-masing database

### 2. Configure Environment Variables in Vercel

Di Vercel dashboard, tambahkan environment variables berikut:

```
NODE_ENV=production
DATABASE_URL_CENTRAL=prisma://accelerate.prisma-data.net/?api_key=YOUR_CENTRAL_API_KEY
DATABASE_URL_BRANCH_BONDOWOSO=prisma://accelerate.prisma-data.net/?api_key=YOUR_BRANCH_API_KEY
DATABASE_URL=prisma://accelerate.prisma-data.net/?api_key=YOUR_CENTRAL_API_KEY
```

### 3. Deploy

```bash
vercel deploy
```

Atau push ke GitHub dan enable automatic deployments di Vercel.

## API Endpoints

### Central Endpoints

#### Master Data

**GET /central/stores**
- Mengambil semua data toko
- Response: Array of Store objects

**GET /central/products**
- Mengambil semua produk aktif
- Response: Array of Product objects

**GET /central/prices/:storeId**
- Mengambil harga aktif untuk toko tertentu
- Response: Array of Price with Product details

#### Price Management

**POST /central/prices**
- Membuat atau update harga produk
- Request body:
```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "salePrice": 15000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**POST /central/sync/prices/:storeId**
- Sinkronisasi harga dari central ke branch
- Response:
```json
{
  "success": true,
  "count": 10,
  "message": "Successfully synchronized 10 record(s)"
}
```

#### Synchronization

**POST /central/sync/sales**
- Sinkronisasi penjualan dari branch ke central
- Response:
```json
{
  "success": true,
  "count": 5,
  "message": "Successfully synchronized 5 record(s)"
}
```

#### Reporting

**GET /central/reports/daily-sales?date=2024-01-01**
- Laporan penjualan harian per toko
- Query params: `date` (required, format: YYYY-MM-DD)
- Response: Array of daily sales summary

### Branch Endpoints

**GET /branch/bondowoso/inventory**
- Mengambil inventory cabang Bondowoso
- Response: Array of Inventory with Product details

**POST /branch/bondowoso/sales**
- Membuat transaksi penjualan baru
- Request body:
```json
{
  "idempotencyKey": "unique-key-123",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 15000
    }
  ]
}
```
- Response: Sale object (201 for new, 200 for existing)

**GET /branch/bondowoso/sales?startDate=2024-01-01&endDate=2024-01-31**
- Mengambil daftar penjualan
- Query params: `startDate`, `endDate` (optional)
- Response: Array of Sale objects

## Error Handling

API menggunakan format error response yang konsisten:

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {}
}
```

Error codes:
- `VALIDATION_ERROR` (422): Input validation failed
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Idempotency key conflict
- `INTERNAL_ERROR` (500): Unexpected server error
- `DATABASE_ERROR` (500): Database operation failed

## Scripts

```bash
# Development
npm run dev          # Start development server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Database
npx prisma migrate dev    # Run migrations
npx prisma db seed        # Seed database
npx prisma studio         # Open Prisma Studio
npx prisma generate       # Generate Prisma Client
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Environment configuration
│   ├── domain/           # Domain layer
│   │   ├── entities/     # Domain entities
│   │   ├── repositories/ # Repository interfaces
│   │   └── usecases/     # Business logic
│   ├── http/             # HTTP layer
│   │   ├── handlers/     # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # Route definitions
│   │   └── schemas/      # Zod validation schemas
│   ├── infra/            # Infrastructure layer
│   │   ├── db/           # Database clients
│   │   ├── mappers/      # Entity to DTO mappers
│   │   └── repositories/ # Prisma repository implementations
│   └── index.ts          # Application entry point
├── prisma/
│   └── schema.prisma     # Prisma schema
├── .env.example          # Environment variables template
├── .env.local            # Local development config
├── vercel.json           # Vercel deployment config
└── package.json
```

## License

ISC
