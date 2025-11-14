# Panduan Simulasi Demo Sistem Replikasi Database

## Status Database
✅ Database Central: **KOSONG**
✅ Database Branch: **KOSONG**

## Akses UI
Buka browser: **http://localhost:3000/dashboard.html**

---

## 🎬 SKENARIO DEMO LENGKAP

### TAHAP 1: Setup Master Data di Pusat

#### 1.1 Buat Toko (Manual via API atau langsung insert)
Karena UI belum ada form tambah toko, gunakan SQL atau API:

```bash
# Via curl (buat toko pusat)
curl -X POST http://localhost:3000/central/stores -H "Content-Type: application/json" -d "{\"code\":\"JMB-001\",\"name\":\"Toko Pusat Jember\",\"type\":\"CENTRAL\",\"city\":\"Jember\"}"

# Via curl (buat toko cabang)
curl -X POST http://localhost:3000/central/stores -H "Content-Type: application/json" -d "{\"code\":\"BDW-001\",\"name\":\"Toko Cabang Bondowoso\",\"type\":\"BRANCH\",\"city\":\"Bondowoso\"}"
```

Atau jalankan seed minimal:
```bash
cd backend
npm run seed-minimal
```

#### 1.2 Tambah Produk di UI
1. Buka **Pusat Jember → Master Produk**
2. Klik **"+ Tambah Produk"**
3. Isi data:
   - Kode: PRD-001
   - Nama: Beras Premium 5kg
   - Kategori: Sembako
   - Satuan: kg
4. Klik **"Simpan"**
5. Ulangi untuk produk lain (minimal 3-5 produk)

**Contoh produk:**
- PRD-001: Beras Premium 5kg (Sembako, kg)
- PRD-002: Minyak Goreng 2L (Sembako, liter)
- PRD-003: Gula Pasir 1kg (Sembako, kg)
- PRD-004: Mie Instan (Makanan, pcs)
- PRD-005: Sabun Mandi (Kebersihan, pcs)

#### 1.3 Set Harga untuk Cabang
1. Buka **Pusat Jember → Master Harga**
2. Klik **"+ Tambah Harga"**
3. Isi data:
   - Cabang: Toko Cabang Bondowoso
   - Produk: Beras Premium 5kg
   - Harga Jual: 65000
   - Tanggal Mulai: (hari ini)
   - Tanggal Selesai: (kosongkan)
4. Klik **"Simpan"**
5. Ulangi untuk produk lain

**Hasil:** Database pusat sekarang punya produk dan harga

---

### TAHAP 2: Replikasi Pusat → Cabang

#### 2.1 Lihat Data Cabang (Masih Kosong)
1. Klik tab **"Cabang Bondowoso"**
2. Buka **"Produk & Harga"**
3. **Lihat:** Tabel kosong atau "Belum ada data"

#### 2.2 Sync dari Pusat
1. Klik tombol **"⬇️ Sync dari Pusat"**
2. **Proses:** Backend membaca database pusat → menulis ke database cabang
3. **Hasil:** Tabel refresh, produk dan harga muncul!

**Penjelasan untuk Dosen:**
> "Ini adalah simulasi replikasi parsial dari pusat ke cabang. Data produk dan harga disalin dari database central ke database branch melalui tombol ini. Dalam production, ini bisa dijadwalkan otomatis."

---

### TAHAP 3: Transaksi di Cabang

#### 3.1 Cek Stok (Opsional)
1. Buka **"Stok Barang"**
2. Lihat inventory yang tersedia
3. (Jika kosong, bisa skip atau tambah manual)

#### 3.2 Buat Transaksi Penjualan
1. Buka **"Transaksi Penjualan"**
2. Pilih Produk: Beras Premium 5kg
3. Isi Jumlah: 2
4. Harga otomatis terisi: 65000
5. Klik **"+ Tambah ke Keranjang"**
6. Tambah produk lain (misal Minyak Goreng, qty 1)
7. Klik **"💾 Simpan Transaksi"**

**Hasil:** 
- Transaksi tersimpan di database cabang
- Status: **PENDING** (belum ke pusat)
- Idempotency key otomatis dibuat

#### 3.3 Lihat Daftar Transaksi
1. Scroll ke bawah ke "Daftar Transaksi Hari Ini"
2. **Lihat:** Transaksi muncul dengan status PENDING (badge kuning)

**Penjelasan untuk Dosen:**
> "Transaksi ini baru ada di database cabang. Status PENDING menunjukkan belum tersinkron ke pusat. Ini mensimulasikan eventual consistency."

---

### TAHAP 4: Replikasi Cabang → Pusat

#### 4.1 Lihat Antrian Sync
1. Buka **"Antrian Sinkronisasi"**
2. **Lihat:** Transaksi PENDING yang siap dikirim

#### 4.2 Kirim ke Pusat
1. Klik **"⬆️ Kirim Semua ke Pusat"**
2. **Proses:** 
   - Backend membaca transaksi PENDING dari database cabang
   - Menyalin ke database pusat
   - Update status jadi SYNCED di cabang
   - Buat log sinkronisasi
3. **Hasil:** Status berubah jadi SYNCED (badge hijau)

**Penjelasan untuk Dosen:**
> "Ini adalah replikasi asinkron dari cabang ke pusat. Transaksi yang tadinya hanya ada di database cabang, sekarang sudah tersalin ke database pusat. Status SYNCED menunjukkan data sudah konsisten."

---

### TAHAP 5: Verifikasi di Pusat

#### 5.1 Lihat Rekap Penjualan
1. Klik tab **"Pusat Jember"**
2. Buka **"Rekap Penjualan"**
3. Pilih tanggal hari ini
4. Klik **"🔄 Refresh Data"**
5. **Lihat:** Data penjualan dari cabang muncul!

**Penjelasan untuk Dosen:**
> "Data penjualan yang tadi dibuat di cabang, sekarang sudah bisa dilihat di pusat. Ini menunjukkan replikasi berhasil dan data sudah teragregasi."

#### 5.2 Lihat Log Replikasi
1. Klik tab **"Log Replikasi"**
2. **Lihat:** Riwayat semua sinkronisasi
   - Sync produk/harga (Pusat → Cabang)
   - Sync transaksi (Cabang → Pusat)
3. Detail: Sumber, Target, Jumlah Record, Waktu

**Penjelasan untuk Dosen:**
> "Log ini mencatat semua aktivitas replikasi. Ini penting untuk audit trail dan debugging jika ada masalah sinkronisasi."

---

## 🎯 DEMO FITUR TAMBAHAN

### Update Harga di Pusat
1. Di **Pusat → Master Harga**
2. Tambah harga baru untuk Beras: Rp 70.000 (harga naik)
3. Set tanggal mulai: besok
4. Di **Cabang → Produk & Harga**, masih Rp 65.000
5. Klik **"Sync dari Pusat"**
6. Harga update jadi Rp 70.000!

**Penjelasan:**
> "Ini menunjukkan bagaimana pusat bisa mengontrol harga di semua cabang secara terpusat."

### Idempotency Test
1. Buat transaksi di cabang
2. Sebelum klik "Kirim ke Pusat", coba refresh browser
3. Transaksi tetap ada (tidak hilang)
4. Klik "Kirim ke Pusat" 2x (simulasi retry)
5. Cek di pusat: hanya 1 transaksi (tidak duplikat)

**Penjelasan:**
> "Idempotency key mencegah duplikasi transaksi saat ada retry request. Ini penting di serverless environment."

---

## 📊 POIN PENTING UNTUK LAPORAN

1. **Arsitektur 2 Database Terpisah**
   - Central: indoagustus_central_dev
   - Branch: indoagustus_branch_dev
   - Simulasi distributed database

2. **Replikasi Parsial**
   - Pusat → Cabang: Produk & Harga
   - Cabang → Pusat: Transaksi Penjualan

3. **Eventual Consistency**
   - Status PENDING/SYNCED
   - Data tidak real-time, tapi konsisten setelah sync

4. **Idempotency**
   - Setiap transaksi punya unique key
   - Prevent duplikasi saat retry

5. **Audit Trail**
   - Log replikasi mencatat semua aktivitas
   - Timestamp, sumber, target, jumlah record

6. **User Interface**
   - Semua replikasi via tombol (manual trigger)
   - Tidak perlu cron job atau background service
   - Mudah dipahami dan di-demo

---

## 🚀 TIPS DEMO

1. **Persiapan:** Pastikan server running (`npm run dev`)
2. **Urutan:** Ikuti tahap 1-5 secara berurutan
3. **Penjelasan:** Setiap klik tombol, jelaskan apa yang terjadi di backend
4. **Screenshot:** Ambil screenshot sebelum dan sesudah sync
5. **Log:** Selalu tunjukkan log replikasi di akhir

**Selamat Demo! 🎉**
