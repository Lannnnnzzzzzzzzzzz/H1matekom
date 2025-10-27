// server.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require("connect-mongodb-session")(session);

// === Import models ===
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
  .catch((err) => console.error("❌ MongoDB
