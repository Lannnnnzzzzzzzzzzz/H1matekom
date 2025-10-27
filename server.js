const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// Import model
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Inventory = require("./models/Inventory");
const Announcement = require("./models/Announcement");

const app = express();

// Konfigurasi MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ ERROR: Environment variable MONGO_URI tidak ditemukan di Vercel!");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Setup EJS dan middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "vercel_default_secret_" + Math.random().toString(36).slice(2),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Middleware auth
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/");
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== "admin") return res.redirect("/");
  next();
};

// Route utama
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect(req.session.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  }
  res.render("login");
});

// Login tanpa register (data hanya dari admin)
app.post("/login", async (req, res) => {
  try {
    const { nim, username } = req.body;
    const user = await User.findOne({ nim, username });

    if (!user) {
      return res.json({ success: false, message: "NIM atau Username tidak ditemukan" });
    }

    req.session.userId = user._id;
    req.session.nim = user.nim;
    req.session.username = user.username;
    req.session.nama = user.nama;
    req.session.role = user.role;
    req.session.kas = user.kas;

    const redirectUrl = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    res.json({ success: true, redirect: redirectUrl });
  } catch (error) {
    res.json({ success: false, message: "Terjadi kesalahan sistem" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// === User Dashboard ===
app.get("/user/dashboard", requireAuth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: "aktif" }).sort("-createdAt");
    const transactions = await Transaction.find();

    const totalPemasukan = transactions
      .filter((t) => t.jenis === "pemasukan")
      .reduce((sum, t) => sum + t.nominal, 0);

    const totalPengeluaran = transactions
      .filter((t) => t.jenis === "pengeluaran")
      .reduce((sum, t) => sum + t.nominal, 0);

    const saldo = totalPemasukan - totalPengeluaran;

    const user = await User.findById(req.session.userId);
    req.session.kas = user.kas;

    res.render("user/dashboard", {
      user: req.session,
      announcements,
      totalPemasukan,
      totalPengeluaran,
      saldo,
    });
  } catch (error) {
    res.status(500).send("Error loading dashboard");
  }
});

// === Admin Routes ===
app.get("/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const transactions = await Transaction.find().sort("-tanggal").limit(10);
    const announcements = await Announcement.find({ status: "aktif" });

    const totalPemasukan = await Transaction.aggregate([
      { $match: { jenis: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const totalPengeluaran = await Transaction.aggregate([
      { $match: { jenis: "pengeluaran" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const pemasukan = totalPemasukan[0]?.total || 0;
    const pengeluaran = totalPengeluaran[0]?.total || 0;
    const saldo = pemasukan - pengeluaran;
    const totalKas = users.filter((u) => u.kas === "lunas").length * 50000;

    res.render("admin/dashboard", {
      page: "dashboard",
      user: req.session,
      totalUsers: users.length,
      totalKas,
      totalPemasukan: pemasukan,
      totalPengeluaran: pengeluaran,
      saldo,
      recentTransactions: transactions,
      announcements,
    });
  } catch (error) {
    res.status(500).send("Error loading admin dashboard");
  }
});

// === API Ro
