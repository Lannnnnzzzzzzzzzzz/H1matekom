const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const MongoDBStore = require("connect-mongodb-session")(session);

// === Import Models ===
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Inventory = require("./models/Inventory");
const Announcement = require("./models/Announcement");

const app = express();

// === Load ENV (untuk lokal, di Vercel otomatis pakai Environment Variable) ===
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// === Konfigurasi MongoDB ===
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ ERROR: Environment variable MONGO_URI tidak ditemukan!");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// === Konfigurasi Session Store (pakai MongoDB agar persist di Vercel) ===
const store = new MongoDBStore({
  uri: mongoUri,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("❌ Session Store Error:", error);
});

// === Setup EJS & Middlewa
