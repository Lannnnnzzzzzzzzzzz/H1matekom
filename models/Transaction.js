const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  tanggal: {
    type: Date,
    required: true,
    default: Date.now
  },
  jenis: {
    type: String,
    enum: ['pemasukan', 'pengeluaran'],
    required: true
  },
  kategori: {
    type: String,
    required: true
  },
  nominal: {
    type: Number,
    required: true
  },
  keterangan: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
