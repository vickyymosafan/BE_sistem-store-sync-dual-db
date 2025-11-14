# Dokumentasi UI Sistem Replikasi Database PT Indo Agustus

## Akses UI

Buka browser dan akses: **http://localhost:3000/dashboard.html**

## Struktur Navigasi

UI terdiri dari 3 section utama yang bisa diakses melalui navbar:
1. **🏢 Pusat Jember** - Manajemen & Pelaporan
2. **🏪 Cabang Bondowoso** - Operasional Kasir
3. **📊 Log Replikasi** - Monitoring Sinkronisasi

---

## 1. PUSAT JEMBER

### 1.1 Master Produk

**Tujuan:** Mengelola data produk yang akan digunakan di semua cabang

**Fitur:**
- Lihat daftar semua produk
- Tambah produk baru
- Edit produk existing
- Aktifkan/Nonaktifkan produk

**Kolom Tabel:**
- Kode Produk
- Nama Produk
- Kategori
- Satuan
- Status (Aktif/Nonaktif)
- Aksi (Edit, Toggle Status)

**Cara Penggunaan:**
1. Klik tombol **"+ Tambah Produk"** untuk menambah produk baru
2. Isi form: Kode, Nama, Kategori, Satuan
3. Klik **"Simpan"**
4. Untuk edit, klik tombol **"Edit"** pada baris produk
5. Untuk nonaktifkan, klik tombol **"Nonaktifkan"**

**Replikasi:**
- Data produk ini akan disalin ke cabang saat cabang melakukan sync produk
- Arah: Pusat → Cabang

---

### 1.2 Master Harga per Cabang

**Tujuan:** Mengatur harga produk untuk setiap cabang

**Fitur:**
- Lihat daftar harga semua cabang
- Filter harga per cabang
- Tambah/edit harga produk
- Set periode berlaku harga (promo)

**Kolom Tabel:**
- Cabang
- Kode Produk
- Nama Produk
- Harga Jual
- Tanggal Mulai Berlaku
- Tanggal Selesai Berlaku
- Status (Aktif/Berakhir)

**Cara Penggunaan:**
1. Klik **"+ Tambah Harga"**
2. Pilih Cabang (Bondowoso)
3. Pilih Produk
4. Isi Harga Jual
5. Isi Tanggal Mulai (wajib)
6. Isi Tanggal Selesai (opsional, untuk promo)
7. Klik **"Simpan"**

**Replikasi:**
- Harga ini akan disalin ke database cabang saat cabang klik "Sync dari Pusat"
- Arah: Pusat → Cabang

---

### 1.3 Rekap Penjualan Harian

**Tujuan:** Melihat laporan penjualan dari semua cabang

**Fitur:**
- Filter berdasarkan tanggal
- Lihat total transaksi dan omzet per cabang
- Refresh data terbaru

**Kolom Tabel:**
- Tanggal
- Kode Cabang
- Nama Cabang
- Total Transaksi
- Total Omzet

**Cara Penggunaan:**
1. Pilih tanggal di filter
2. Klik **"🔄 Refresh Data"** untuk reload
3. Data akan muncul setelah cabang melakukan sync transaksi ke pusat

**Replikasi:**
- Data ini berasal dari transaksi yang dikirim cabang ke pusat
- Arah: Cabang → Pusat (sudah tersinkron)

---

## 2. CABANG BONDOWOSO

### 2.1 Produk & Harga Lokal

**Tujuan:** Menampilkan produk dan harga yang tersimpan di database lokal cabang

**Fitur:**
- Lihat produk dan harga lokal
- Sync produk dan harga dari pusat

**Kolom Tabel:**
- Kode Produk
- Nama Produk
- Harga Jual Aktif
- Status
- Tanggal Mulai Berlaku
- Tanggal Selesai Berlaku

**Cara Penggunaan:**
1. Klik **"⬇️ Sync dari Pusat"**
2. Sistem akan mengambil data produk dan harga dari database pusat
3. Data lokal cabang akan diperbarui
4. Tabel akan refresh otomatis

**Simulasi Replikasi:**
- Tombol "Sync dari Pusat" mensimulasikan replikasi parsial
- Backend membaca dari database pusat
- Backend menulis ke database cabang
- Ini adalah **replikasi Pusat → Cabang**

---

### 2.2 Stok Barang Cabang

**Tujuan:** Mengelola inventory/stok barang di cabang

**Fitur:**
- Lihat stok semua produk
- Tambah stok (saat barang datang)
- Koreksi stok (barang rusak/hilang)

**Kolom Tabel:**
- Kode Produk
- Nama Produk
- Stok Sekarang
- Satuan
- Terakhir Diupdate

**Cara Penggunaan:**
1. Lihat stok yang tersedia
2. Klik **"+ Tambah Stok"** untuk menambah stok (fitur ini bisa dikembangkan)

**Catatan:**
- Stok hanya tersimpan di database cabang
- Tidak ada replikasi stok ke pusat (untuk demo ini)

---

### 2.3 Transaksi Penjualan

**Tujuan:** Mencatat transaksi penjualan di kasir

**Fitur:**
- Form input transaksi (seperti kasir)
- Keranjang belanja
- Simpan transaksi dengan idempotency key
- Lihat daftar transaksi hari ini

**Cara Penggunaan:**

**Membuat Transaksi:**
1. Pilih Produk dari dropdown
2. Isi Jumlah
3. Harga akan terisi otomatis
4. Klik **"+ Tambah ke Keranjang"**
5. Ulangi untuk produk lain
6. Klik **"💾 Simpan Transaksi"**

**Idempotency:**
- Setiap transaksi punya idempotency key unik
- Jika kasir tidak sengaja klik 2x, transaksi tidak duplikat
- Ini mensimulasikan idempotency di serverless environment

**Tabel Transaksi Hari Ini:**
- ID Transaksi
- Waktu Transaksi
- Total
- Status Sync (PENDING/SYNCED)
- Idempotency Key

**Replikasi:**
- Transaksi disimpan dengan status **PENDING**
- Belum ada di database pusat
- Menunggu proses sync ke pusat

---

### 2.4 Antrian Sinkronisasi

**Tujuan:** Mengirim transaksi PENDING ke database pusat

**Fitur:**
- Lihat transaksi yang belum tersinkron
- Kirim semua transaksi PENDING ke pusat
- Lihat status sync

**Kolom Tabel:**
- ID Transaksi
- Waktu Transaksi
- Total
- Status Sync
- Idempotency Key

**Cara Penggunaan:**
1. Lihat transaksi dengan status PENDING
2. Klik **"⬆️ Kirim Semua ke Pusat"**
3. Sistem akan:
   - Membaca transaksi PENDING dari database cabang
   - Menyalin ke database pusat
   - Update status menjadi SYNCED di cabang
   - Membuat log sinkronisasi
4. Tabel akan refresh, status berubah jadi SYNCED

**Simulasi Replikasi Asinkron:**
- Ini mensimulasikan replikasi **Cabang → Pusat**
- Transaksi dikirim secara batch
- Jika gagal, bisa retry
- Status PENDING/SYNCED menunjukkan eventual consistency

---

## 3. LOG REPLIKASI

**Tujuan:** Monitoring semua aktivitas sinkronisasi

**Fitur:**
- Lihat riwayat sinkronisasi
- Detail sumber dan target
- Jumlah record yang diproses
- Waktu sinkronisasi

**Kolom Tabel:**
- ID Log
- Sumber (Cabang Bondowoso)
- Target (Toko Pusat Jember)
- Jumlah Record
- Waktu
- Catatan

**Cara Penggunaan:**
1. Klik **"🔄 Refresh"** untuk reload data
2. Lihat log setiap kali ada sinkronisasi
3. Log dibuat otomatis saat:
   - Cabang sync produk/harga dari pusat
   - Cabang kirim transaksi ke pusat

**Manfaat:**
- Audit trail sinkronisasi
- Debugging jika ada masalah
- Bukti replikasi berjalan

---

## ALUR REPLIKASI LENGKAP

### Skenario 1: Pusat Update Harga → Cabang

1. **Di Pusat:** Admin buka "Master Harga"
2. **Di Pusat:** Klik "Tambah Harga", pilih cabang Bondowoso, set harga baru
3. **Di Pusat:** Klik "Simpan" → Data tersimpan di database pusat
4. **Di Cabang:** Kasir buka "Produk & Harga"
5. **Di Cabang:** Klik "Sync dari Pusat"
6. **Backend:** Membaca harga dari database pusat
7. **Backend:** Menulis/update harga di database cabang
8. **Di Cabang:** Tabel refresh, harga baru muncul
9. **Replikasi:** Pusat → Cabang (SELESAI)

### Skenario 2: Cabang Jual → Pusat Terima Data

1. **Di Cabang:** Kasir buka "Transaksi Penjualan"
2. **Di Cabang:** Input produk, jumlah, tambah ke keranjang
3. **Di Cabang:** Klik "Simpan Transaksi"
4. **Backend:** Simpan transaksi di database cabang dengan status PENDING
5. **Di Cabang:** Buka "Antrian Sinkronisasi"
6. **Di Cabang:** Klik "Kirim Semua ke Pusat"
7. **Backend:** Membaca transaksi PENDING dari database cabang
8. **Backend:** Menyalin transaksi ke database pusat
9. **Backend:** Update status jadi SYNCED di database cabang
10. **Backend:** Buat log sinkronisasi di database pusat
11. **Di Pusat:** Buka "Rekap Penjualan", data muncul
12. **Di Log:** Buka "Log Replikasi", ada catatan sync
13. **Replikasi:** Cabang → Pusat (SELESAI)

---

## TEKNOLOGI

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL (2 instances terpisah)
- **ORM:** Prisma
- **Arsitektur:** Clean Architecture dengan 3 layers

---

## CATATAN PENTING

1. **Tidak Ada Auto-Sync:** Semua replikasi dilakukan manual via tombol (untuk demo)
2. **Idempotency:** Transaksi punya key unik untuk prevent duplikasi
3. **Eventual Consistency:** Data tidak real-time, tapi konsisten setelah sync
4. **Simulasi Replikasi:** Semua replikasi dilakukan via interface, bukan background job
5. **2 Database Terpisah:** Central dan Branch punya database sendiri

---

## TROUBLESHOOTING

**Q: Produk tidak muncul di cabang?**
A: Klik "Sync dari Pusat" di halaman Produk & Harga Cabang

**Q: Transaksi tidak muncul di rekap pusat?**
A: Pastikan sudah klik "Kirim Semua ke Pusat" di Antrian Sinkronisasi Cabang

**Q: Harga tidak update di cabang?**
A: Setelah update harga di pusat, cabang harus sync ulang

**Q: Status transaksi masih PENDING?**
A: Klik "Kirim Semua ke Pusat" untuk mengubah status jadi SYNCED

---

## DEMO UNTUK DOSEN

1. Tunjukkan halaman Master Produk (pusat kelola data)
2. Tunjukkan halaman Master Harga (pusat set harga per cabang)
3. Tunjukkan halaman Produk Cabang (data lokal cabang)
4. Klik "Sync dari Pusat" → Tunjukkan data berubah (replikasi pusat→cabang)
5. Buat transaksi di cabang → Tunjukkan status PENDING
6. Klik "Kirim ke Pusat" → Tunjukkan status jadi SYNCED (replikasi cabang→pusat)
7. Buka Rekap Penjualan di pusat → Tunjukkan data muncul
8. Buka Log Replikasi → Tunjukkan catatan sinkronisasi

**Kesimpulan:** Semua replikasi database berjalan via interface, tanpa cron job atau background service. Ini mensimulasikan distributed database dengan eventual consistency.
