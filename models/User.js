const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nim: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  kas: {
    type: String,
    enum: ['lunas', 'belum'],
    default: 'belum'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
