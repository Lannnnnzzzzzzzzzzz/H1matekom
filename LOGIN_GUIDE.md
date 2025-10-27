# 🔐 Panduan Login HIMAFIN

## Kredensial Login

### 👤 Admin
- **NIM**: `24011150511`
- **Username**: `admin`
- **Akses**: Full control (Dashboard, User Management, Keuangan, Inventaris, Pengumuman)

### 👨‍🎓 User Biasa
- **NIM**: `24011150512`
- **Username**: `muhammadnur`
- **Status Kas**: Belum (akan muncul warning banner)
- **Akses**: Dashboard pribadi, lihat pengumuman, lihat ringkasan keuangan

### 👨‍🎓 User Lain
1. **Budi Santoso**
   - NIM: `24011150513`
   - Username: `budisantoso`
   - Status Kas: Lunas ✓

2. **Siti Nur Halizah**
   - NIM: `24011150514`
   - Username: `sitinurhalizah`
   - Status Kas: Lunas ✓

## 🎯 Flow Login

### 1. Halaman Login
- Background gradient biru HIMATEKOM (#0052CC)
- Card putih di tengah dengan logo HIMAFIN
- Form input NIM dan Username
- Tombol "Masuk" dengan icon
- Pesan "Tidak bisa login? Hubungi admin"

### 2. Proses Login
```
Input NIM + Username → Validasi di Database → Session → Redirect
```

### 3. Redirect Berdasarkan Role
- **Admin** → `/admin/dashboard`
- **User** → `/user/dashboard`

## ✨ Fitur Setelah Login

### Dashboard Admin
1. **Header**
   - Judul "Dashboard Admin"
   - Badge merah "Admin"
   - Toggle dark mode
   
2. **Statistik Cards**
   - Total User: 4
   - Total Kas: Rp 150.000 (3 user lunas)
   - Total Pemasukan: Rp 850.000
   - Total Pengeluaran: Rp 450.000

3. **Quick Actions**
   - Tambah User Baru
   - Kirim Pengumuman
   - Tambah Transaksi

4. **Sidebar Menu**
   - Dashboard
   - User Management
   - Keuangan
   - Inventaris
   - Pengumuman
   - Logout

5. **Transaksi Terakhir**
   - Tabel dengan 5 transaksi terbaru
   
6. **Saldo Organisasi**
   - Saldo: Rp 400.000
   - Progress bar pemasukan vs pengeluaran

### Dashboard User
1. **Header**
   - Nama user
   - Badge biru dengan nama
   - Toggle dark mode
   - Tombol Logout

2. **Welcome Banner**
   - Gradient biru dengan greeting
   - Info NIM dan Username

3. **Warning Banner (jika kas = belum)**
   ```
   ⚠️ Anda belum membayar uang kas bulan ini. 
   Silakan bayar ke bendahara.
   ```

4. **Statistik Cards**
   - Total Pemasukan Organisasi
   - Total Pengeluaran Organisasi
   - Saldo Organisasi

5. **Grafik Keuangan**
   - Line chart dengan Chart.js
   - Pemasukan vs Pengeluaran per bulan

6. **Pengumuman**
   - 3 pengumuman aktif:
     1. Pembayaran Kas Bulan Februari
     2. Rapat Koordinasi Minggu Depan
     3. Workshop Programming

## 🎨 UI/UX Features

### Design System
- **Warna Utama**: #0052CC (Biru HIMATEKOM)
- **Background**: #F5F7FA (Abu Muda)
- **Font**: Poppins
- **Icons**: Bootstrap Icons
- **Framework**: Bootstrap 5

### Interactive Elements
- ✓ Smooth page transitions (fadeIn animation)
- ✓ Card hover effects (transform + shadow)
- ✓ Dark mode toggle (localStorage persistence)
- ✓ Responsive design (mobile-friendly)
- ✓ Interactive charts (Chart.js)

### Dark Mode
- Klik icon bulan/matahari di navbar
- Otomatis tersimpan di localStorage
- Semua warna adjust otomatis

## 🔒 Session Management
- Session duration: 24 jam
- Auto-redirect jika belum login
- Auto-redirect jika sudah login
- Logout menghapus session

## 📱 Responsive Breakpoints
- Desktop: Full sidebar + content
- Tablet: Sidebar collapsible
- Mobile: Hamburger menu, cards stack vertical

## 🚀 Testing Flow

### Test Login Admin
1. Buka aplikasi
2. Masukkan NIM: `24011150511`
3. Masukkan Username: `admin`
4. Klik "Masuk"
5. Redirect ke `/admin/dashboard`
6. Cek semua fitur admin

### Test Login User
1. Buka aplikasi
2. Masukkan NIM: `24011150512`
3. Masukkan Username: `muhammadnur`
4. Klik "Masuk"
5. Redirect ke `/user/dashboard`
6. Lihat warning banner "Belum bayar kas"
7. Lihat 3 pengumuman
8. Lihat grafik keuangan

## 💡 Tips
- Gunakan dark mode untuk kenyamanan mata
- Admin bisa ubah status kas user
- Pengumuman langsung terlihat semua user
- Grafik update otomatis saat ada transaksi baru
