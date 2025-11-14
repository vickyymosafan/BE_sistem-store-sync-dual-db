# Changelog - Fitur Nonaktifkan Produk

## Perubahan yang Dilakukan

### 1. Filter Produk di Master Produk
- Menambahkan tombol filter: **Semua**, **Aktif**, **Nonaktif**
- API endpoint `/central/products` sekarang mendukung query parameter `?status=active|inactive|all`
- Menampilkan empty state ketika tidak ada produk sesuai filter

### 2. Otomatis Sembunyikan Harga Produk Nonaktif
- **Master Harga (Pusat)**: Hanya menampilkan harga dari produk yang aktif
- **Produk & Harga Cabang**: Hanya menampilkan produk aktif dan harganya
- Menambahkan info box yang menjelaskan bahwa produk nonaktif tidak ditampilkan

### 3. Perubahan Backend

#### File yang Diubah:
1. `src/http/handlers/central/listProductsHandler.ts`
   - Menambahkan filter berdasarkan query parameter `status`
   - Support: `active`, `inactive`, `all`

2. `src/infra/repositories/prisma/PriceRepositoryPrisma.ts`
   - Menambahkan filter `product.active = true` di query `findActiveByStoreId`
   - Harga dari produk nonaktif tidak akan dikembalikan

3. `src/http/handlers/branch/branchDataHandler.ts`
   - Menambahkan filter `active: true` saat mengambil produk cabang
   - Produk nonaktif tidak akan muncul di daftar produk cabang

### 4. Perubahan Frontend

#### File yang Diubah:
1. `public/dashboard.html`
   - Menambahkan tombol filter di halaman Master Produk
   - Menambahkan info box di Master Harga dan Produk Cabang
   - Styling untuk button filter

2. `public/dashboard.js`
   - Menambahkan fungsi `filterProducts(status)`
   - Menambahkan state `currentProductFilter`
   - Update `loadProducts()` untuk support parameter status
   - Menampilkan empty state ketika tidak ada data

## Cara Kerja

### Skenario 1: Nonaktifkan Produk
1. Admin membuka **Master Produk**
2. Klik tombol **Nonaktifkan** pada produk tertentu
3. Produk akan hilang dari:
   - Daftar harga di **Master Harga**
   - Daftar produk di **Produk & Harga Cabang**
   - Dropdown pilihan produk saat buat transaksi

### Skenario 2: Lihat Produk Nonaktif
1. Admin membuka **Master Produk**
2. Klik tombol filter **Nonaktif**
3. Akan muncul daftar produk yang sudah dinonaktifkan
4. Admin bisa mengaktifkan kembali dengan klik tombol **Aktifkan**

### Skenario 3: Sync dari Pusat
1. Cabang melakukan sync produk dari pusat
2. Hanya produk aktif yang akan di-sync
3. Produk nonaktif tidak akan muncul di database cabang

## Manfaat

✅ **Kontrol Produk**: Admin bisa menonaktifkan produk tanpa menghapus data historis
✅ **Konsistensi Data**: Produk nonaktif otomatis tersembunyi di semua modul
✅ **Mudah Reaktivasi**: Produk bisa diaktifkan kembali kapan saja
✅ **Audit Trail**: Data produk nonaktif tetap tersimpan untuk keperluan laporan

## Testing

Untuk testing fitur ini:

```bash
# 1. Jalankan server
npm run dev

# 2. Buka browser
http://localhost:3000/dashboard.html

# 3. Test flow:
- Buka Master Produk
- Nonaktifkan beberapa produk
- Cek Master Harga (produk nonaktif tidak muncul)
- Klik filter "Nonaktif" di Master Produk
- Aktifkan kembali produk
- Cek Master Harga (produk muncul kembali)
```
