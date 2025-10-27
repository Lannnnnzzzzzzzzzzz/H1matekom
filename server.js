require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Inventory = require('./models/Inventory');
const Announcement = require('./models/Announcement');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.redirect('/');
  }
  next();
};

app.get('/', (req, res) => {
  if (req.session.userId) {
    if (req.session.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/user/dashboard');
    }
  }
  res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const { nim, username } = req.body;
    const user = await User.findOne({ nim, username });
    
    if (!user) {
      return res.json({ success: false, message: 'NIM atau Username tidak ditemukan' });
    }
    
    req.session.userId = user._id;
    req.session.nim = user.nim;
    req.session.username = user.username;
    req.session.nama = user.nama;
    req.session.role = user.role;
    req.session.kas = user.kas;
    
    const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    res.json({ success: true, redirect: redirectUrl });
  } catch (error) {
    res.json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/user/dashboard', requireAuth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'aktif' }).sort('-createdAt');
    const transactions = await Transaction.find();
    
    const totalPemasukan = transactions
      .filter(t => t.jenis === 'pemasukan')
      .reduce((sum, t) => sum + t.nominal, 0);
    
    const totalPengeluaran = transactions
      .filter(t => t.jenis === 'pengeluaran')
      .reduce((sum, t) => sum + t.nominal, 0);
    
    const saldo = totalPemasukan - totalPengeluaran;
    
    const user = await User.findById(req.session.userId);
    req.session.kas = user.kas;
    
    res.render('user/dashboard', {
      user: req.session,
      announcements,
      totalPemasukan,
      totalPengeluaran,
      saldo
    });
  } catch (error) {
    res.status(500).send('Error loading dashboard');
  }
});

app.get('/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const transactions = await Transaction.find().sort('-tanggal').limit(10);
    const announcements = await Announcement.find({ status: 'aktif' });
    
    const totalPemasukan = await Transaction.aggregate([
      { $match: { jenis: 'pemasukan' } },
      { $group: { _id: null, total: { $sum: '$nominal' } } }
    ]);
    
    const totalPengeluaran = await Transaction.aggregate([
      { $match: { jenis: 'pengeluaran' } },
      { $group: { _id: null, total: { $sum: '$nominal' } } }
    ]);
    
    const pemasukan = totalPemasukan[0]?.total || 0;
    const pengeluaran = totalPengeluaran[0]?.total || 0;
    const saldo = pemasukan - pengeluaran;
    
    const totalKas = users.filter(u => u.kas === 'lunas').length * 50000;
    
    res.render('admin/dashboard', {
      page: 'dashboard',
      user: req.session,
      totalUsers: users.length,
      totalKas,
      totalPemasukan: pemasukan,
      totalPengeluaran: pengeluaran,
      saldo,
      recentTransactions: transactions,
      announcements
    });
  } catch (error) {
    res.status(500).send('Error loading admin dashboard');
  }
});

app.get('/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.render('admin/users', { page: 'users', user: req.session, users });
  } catch (error) {
    res.status(500).send('Error loading users');
  }
});

app.post('/admin/users/add', requireAdmin, async (req, res) => {
  try {
    const { nim, username, nama, role, kas } = req.body;
    await User.create({ nim, username, nama, role, kas });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/users/update/:id', requireAdmin, async (req, res) => {
  try {
    const { nim, username, nama, role, kas } = req.body;
    await User.findByIdAndUpdate(req.params.id, { nim, username, nama, role, kas });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/users/delete/:id', requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.get('/admin/finance', requireAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort('-tanggal');
    res.render('admin/finance', { page: 'finance', user: req.session, transactions });
  } catch (error) {
    res.status(500).send('Error loading finance');
  }
});

app.post('/admin/finance/add', requireAdmin, async (req, res) => {
  try {
    const { tanggal, jenis, kategori, nominal, keterangan } = req.body;
    await Transaction.create({ tanggal, jenis, kategori, nominal, keterangan });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/finance/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.get('/admin/inventory', requireAdmin, async (req, res) => {
  try {
    const inventories = await Inventory.find().sort('-tanggalMasuk');
    res.render('admin/inventory', { page: 'inventory', user: req.session, inventories });
  } catch (error) {
    res.status(500).send('Error loading inventory');
  }
});

app.post('/admin/inventory/add', requireAdmin, async (req, res) => {
  try {
    const { nama, jumlah, kondisi, lokasi, tanggalMasuk } = req.body;
    await Inventory.create({ nama, jumlah, kondisi, lokasi, tanggalMasuk });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/inventory/update/:id', requireAdmin, async (req, res) => {
  try {
    const { nama, jumlah, kondisi, lokasi, tanggalMasuk } = req.body;
    await Inventory.findByIdAndUpdate(req.params.id, { nama, jumlah, kondisi, lokasi, tanggalMasuk });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/inventory/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.get('/admin/announcements', requireAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort('-createdAt');
    res.render('admin/announcements', { page: 'announcements', user: req.session, announcements });
  } catch (error) {
    res.status(500).send('Error loading announcements');
  }
});

app.post('/admin/announcements/add', requireAdmin, async (req, res) => {
  try {
    const { judul, isi } = req.body;
    await Announcement.create({ judul, isi, status: 'aktif' });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/announcements/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/admin/announcements/archive/:id', requireAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { status: 'arsip' });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.get('/api/transactions/monthly', requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$tanggal' },
            year: { $year: '$tanggal' },
            jenis: '$jenis'
          },
          total: { $sum: '$nominal' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
});
