const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  jumlah: {
    type: Number,
    required: true,
    default: 0
  },
  kondisi: {
    type: String,
    enum: ['Baik', 'Rusak'],
    default: 'Baik'
  },
  lokasi: {
    type: String,
    required: true
  },
  tanggalMasuk: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
