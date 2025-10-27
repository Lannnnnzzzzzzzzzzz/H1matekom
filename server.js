// server.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require("connect-mongodb-session")(session);

// Import models
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Inventory = require("./models/Inventory");
const Announcement = require("./models/Announcement");

const app = express();

// === MongoDB ===
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ ERROR: Environment variable MONGO_URI tidak ditemukan di Vercel!");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// === EJS & Middleware ===
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "vercel_default_secret_" + Math.random().toString(36).slice(2),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      uri: mongoUri,
      collection: "sessions",
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// === Middleware auth ===
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/");
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== "admin") return res.redirect("/");
  next();
};

// === Routes utama ===
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect(
      req.session.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
    );
  }
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { nim, username } = req.body;
    const user = await User.findOne({ nim, username });
    if (!user) return res.json({ success: false, message: "NIM atau Username tidak ditemukan" });

    req.session.userId = user._id;
    req.session.nim = user.nim;
    req.session.username = user.username;
    req.session.nama = user.nama;
    req.session.role = user.role;
    req.session.kas = user.kas;

    const redirectUrl = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    res.json({ success: true, redirect: redirectUrl });
  } catch {
    res.json({ success: false, message: "Terjadi kesalahan sistem" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// contoh route
app.get("/user/dashboard", requireAuth, (req, res) => {
  res.render("user/dashboard", { user: req.session });
});

// ✅ Fix untuk Vercel — jangan pakai app.listen di sini
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
}
