// server.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require("connect-mongodb-session")(session);

// Models
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Inventory = require("./models/Inventory");
const Announcement = require("./models/Announcement");

const app = express();

// === Database ===
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI not found!");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// === Session Store ===
let store;
try {
  store = new MongoStore({
    uri: mongoUri,
    collection: "sessions",
  });
} catch (err) {
  console.warn("⚠️ MongoStore gagal dibuat, fallback ke MemoryStore (dev only)");
}

// === Middleware ===
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ PENTING: path absolut public agar CSS ke-load di vercel
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "vercel_secret_" + Math.random().toString(36).slice(2),
    resave: false,
    saveUninitialized: false,
    store: store || undefined,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// === Auth Middleware ===
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/");
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== "admin")
    return res.redirect("/");
  next();
};

// === Routes ===
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
    if (!user)
      return res.json({ success: false, message: "NIM atau Username tidak ditemukan" });

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.username = user.username;
    req.session.nim = user.nim;
    req.session.nama = user.nama;

    res.json({
      success: true,
      redirect:
        user.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
    });
  } catch (e) {
    console.error("Login error:", e);
    res.json({ success: false, message: "Server error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// === User Dashboard ===
app.get("/user/dashboard", requireAuth, async (req, res) => {
  res.render("user/dashboard", { user: req.session });
});

// === Admin Dashboard ===
app.get("/admin/dashboard", requireAdmin, async (req, res) => {
  res.render("admin/dashboard", { user: req.session });
});

// === Fix for Vercel ===
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`✅ Local server running on port ${PORT}`)
  );
}
