# HIMATEKOM Financial Inventory System (HIMAFIN)

## 📋 Overview
Aplikasi web untuk mengelola data keuangan & inventaris organisasi HIMATEKOM. Sistem ini mencakup manajemen user, keuangan, inventaris, dan pengumuman dengan UI/UX yang modern dan responsif.

## 🎨 Design System
- **Warna Utama**: #0052CC (Biru HIMATEKOM)
- **Warna Sekunder**: #F5F7FA (Abu Muda)
- **Font**: Poppins
- **Framework**: Bootstrap 5
- **Dark Mode**: ✓ Tersedia

## 🚀 Tech Stack
- **Frontend**: EJS + Bootstrap 5 + Chart.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Session**: Express Session

## 📁 Project Structure
```
.
├── models/               # MongoDB schemas
│   ├── User.js
│   ├── Transaction.js
│   ├── Inventory.js
│   └── Announcement.js
├── views/               # EJS templates
│   ├── login.ejs
│   ├── admin/          # Admin pages
│   │   ├── dashboard.ejs
│   │   ├── users.ejs
│   │   ├── finance.ejs
│   │   ├── inventory.ejs
│   │   └── announcements.ejs
│   ├── user/           # User pages
│   │   └── dashboard.ejs
│   └── partials/       # Shared components
│       └── sidebar.ejs
├── public/             # Static assets
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── theme.js
├── server.js           # Main server file
├── seed.js             # Database seeding script
└── package.json
```

## ⚙️ Features

### 1. Authentication System
- Login dengan NIM dan Username (tanpa password)
- Role-based access (Admin & User)
- Session management

### 2. User Dashboard
- Status pembayaran kas dengan warning banner
- Pengumuman dari admin
- Ringkasan keuangan organisasi
- Grafik arus kas interaktif

### 3. Admin Dashboard
- Statistik lengkap (user, kas, keuangan)
- User Management (CRUD)
- Manajemen Keuangan (pemasukan/pengeluaran)
- Manajemen Inventaris
- Sistem Pengumuman

### 4. User Management
- Tambah/Edit/Hapus user
- Update status kas
- Role management

### 5. Finance Management
- Catat pemasukan & pengeluaran
- Kategori transaksi
- Grafik per bulan
- Laporan keuangan

### 6. Inventory Management
- CRUD inventaris
- Status kondisi barang
- Pencarian real-time
- Tracking lokasi

### 7. Announcements
- Broadcast ke semua user
- Arsip pengumuman lama
- Status aktif/arsip

## 🔧 Environment Variables
```
MONGO_URI=mongodb+srv://...
SESSION_SECRET=your_secret_key
PORT=5000
```

## ⚠️ IMPORTANT: MongoDB Atlas Setup
**Anda perlu menambahkan IP Replit ke whitelist MongoDB Atlas:**

1. Login ke [MongoDB Atlas](https://cloud.mongodb.com)
2. Pilih cluster Anda
3. Klik "Network Access" di sidebar
4. Klik "Add IP Address"
5. Pilih "Allow Access from Anywhere" (0.0.0.0/0) untuk development
6. Klik "Confirm"

Tanpa ini, aplikasi tidak bisa connect ke database.

## 📦 Installation & Running

### First Time Setup
```bash
npm install
node seed.js    # Seed database (setelah whitelist IP)
npm start       # Run server
```

### Login Credentials (After Seeding)
**Admin:**
- NIM: 24011150511
- Username: admin

**User:**
- NIM: 24011150512
- Username: muhammadnur

## 🎯 How to Use

### As Admin:
1. Login dengan kredensial admin
2. Akses semua fitur melalui sidebar:
   - Dashboard: Lihat ringkasan
   - User Management: Kelola anggota
   - Keuangan: Catat transaksi
   - Inventaris: Kelola barang
   - Pengumuman: Kirim broadcast

### As User:
1. Login dengan kredensial user
2. Lihat:
   - Status pembayaran kas
   - Pengumuman dari admin
   - Ringkasan keuangan organisasi

## 🌙 Dark Mode
Klik ikon bulan/matahari di navbar untuk toggle dark mode. Preferensi disimpan di localStorage.

## 📱 Responsive Design
100% mobile-friendly dan responsive di semua perangkat.

## 🔒 Security Features
- Session-based authentication
- Role-based access control
- Input validation
- Environment variable secrets

## 📊 Database Collections

### users
- nim, username, nama, role, kas

### transactions
- tanggal, jenis, kategori, nominal, keterangan

### inventories
- nama, jumlah, kondisi, lokasi, tanggalMasuk

### announcements
- judul, isi, status, tanggal

## 🎨 UI/UX Features
- Smooth page transitions
- Card hover effects
- Responsive tables
- Interactive charts (Chart.js)
- Search & filter functionality
- Modern gradient backgrounds
- Bootstrap Icons
- Custom color scheme

## 📝 Recent Changes
- 2025-10-27: Initial project setup
- Complete CRUD for all modules
- Dark mode implementation
- Chart.js integration
- Responsive design complete

## 🔄 Next Steps
1. Whitelist IP di MongoDB Atlas
2. Jalankan `node seed.js` untuk seed database
3. Test semua fitur
4. Deploy ke production

## 💡 Tips
- Gunakan admin account untuk setup awal
- Seed database untuk mendapatkan sample data
- Dark mode otomatis tersimpan
- Semua tabel support searching
