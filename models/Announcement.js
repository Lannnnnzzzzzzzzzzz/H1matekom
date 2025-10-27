const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  isi: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['aktif', 'arsip'],
    default: 'aktif'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
