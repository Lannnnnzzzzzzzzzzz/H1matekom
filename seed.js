require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Inventory = require('./models/Inventory');
const Announcement = require('./models/Announcement');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB Connected');
    
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Inventory.deleteMany({});
    await Announcement.deleteMany({});
    
    console.log('🗑️  Database cleared');
    
    const users = await User.insertMany([
      {
        nim: '24011150511',
        username: 'admin',
        nama: 'Admin HIMATEKOM',
        role: 'admin',
        kas: 'lunas'
      },
      {
        nim: '24011150512',
        username: 'muhammadnur',
        nama: 'Muhammad Nur Arfi Ramadhan',
        role: 'user',
        kas: 'belum'
      },
      {
        nim: '24011150513',
        username: 'budisantoso',
        nama: 'Budi Santoso',
        role: 'user',
        kas: 'lunas'
      },
      {
        nim: '24011150514',
        username: 'sitinurhalizah',
        nama: 'Siti Nur Halizah',
        role: 'user',
        kas: 'lunas'
      }
    ]);
    console.log('✓ Users seeded:', users.length);
    
    const transactions = await Transaction.insertMany([
      {
        tanggal: new Date('2025-01-05'),
        jenis: 'pemasukan',
        kategori: 'Kas Anggota',
        nominal: 200000,
        keterangan: 'Pembayaran kas 4 anggota @ Rp 50.000'
      },
      {
        tanggal: new Date('2025-01-10'),
        jenis: 'pengeluaran',
        kategori: 'Konsumsi Rapat',
        nominal: 150000,
        keterangan: 'Pembelian snack dan minuman untuk rapat koordinasi'
      },
      {
        tanggal: new Date('2025-01-15'),
        jenis: 'pemasukan',
        kategori: 'Donasi',
        nominal: 500000,
        keterangan: 'Donasi dari alumni untuk kegiatan organisasi'
      },
      {
        tanggal: new Date('2025-02-01'),
        jenis: 'pemasukan',
        kategori: 'Kas Anggota',
        nominal: 150000,
        keterangan: 'Pembayaran kas 3 anggota bulan Februari'
      },
      {
        tanggal: new Date('2025-02-10'),
        jenis: 'pengeluaran',
        kategori: 'Perlengkapan',
        nominal: 300000,
        keterangan: 'Pembelian ATK dan perlengkapan organisasi'
      }
    ]);
    console.log('✓ Transactions seeded:', transactions.length);
    
    const inventories = await Inventory.insertMany([
      {
        nama: 'Laptop Lenovo ThinkPad',
        jumlah: 2,
        kondisi: 'Baik',
        lokasi: 'Ruang Lab Komputer',
        tanggalMasuk: new Date('2024-08-15')
      },
      {
        nama: 'Proyektor Epson EB-X41',
        jumlah: 1,
        kondisi: 'Baik',
        lokasi: 'Ruang Meeting',
        tanggalMasuk: new Date('2024-09-01')
      },
      {
        nama: 'Meja Lipat',
        jumlah: 10,
        kondisi: 'Baik',
        lokasi: 'Gudang',
        tanggalMasuk: new Date('2024-07-20')
      },
      {
        nama: 'Kursi Plastik',
        jumlah: 25,
        kondisi: 'Baik',
        lokasi: 'Gudang',
        tanggalMasuk: new Date('2024-07-20')
      },
      {
        nama: 'Whiteboard',
        jumlah: 2,
        kondisi: 'Rusak',
        lokasi: 'Ruang Meeting',
        tanggalMasuk: new Date('2024-06-10')
      },
      {
        nama: 'Kamera DSLR Canon',
        jumlah: 1,
        kondisi: 'Baik',
        lokasi: 'Ruang Media',
        tanggalMasuk: new Date('2024-10-05')
      }
    ]);
    console.log('✓ Inventories seeded:', inventories.length);
    
    const announcements = await Announcement.insertMany([
      {
        judul: 'Pembayaran Kas Bulan Februari',
        isi: 'Kepada seluruh anggota HIMATEKOM, dimohon untuk segera melakukan pembayaran kas bulan Februari sebesar Rp 50.000 kepada bendahara. Terima kasih.',
        status: 'aktif'
      },
      {
        judul: 'Rapat Koordinasi Minggu Depan',
        isi: 'Akan diadakan rapat koordinasi pada hari Kamis, 30 Januari 2025 pukul 15.00 WIB di Ruang Lab. Kehadiran seluruh anggota sangat diharapkan.',
        status: 'aktif'
      },
      {
        judul: 'Workshop Programming',
        isi: 'HIMATEKOM akan mengadakan workshop programming dasar untuk semua anggota. Pendaftaran dibuka mulai hari ini. Info lebih lanjut hubungi koordinator acara.',
        status: 'aktif'
      }
    ]);
    console.log('✓ Announcements seeded:', announcements.length);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Transactions: ${transactions.length}`);
    console.log(`   Inventories: ${inventories.length}`);
    console.log(`   Announcements: ${announcements.length}`);
    console.log('\n👤 Login credentials:');
    console.log('   Admin - NIM: 24011150511, Username: admin');
    console.log('   User  - NIM: 24011150512, Username: muhammadnur');
    
    await mongoose.disconnect();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
