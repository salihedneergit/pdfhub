const mongoose = require('mongoose');

const deviceSessionSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceInfo: {
    browser: String,
    os: String,
  },
  ip : {type: String, default: "not available"},
  lastLogin: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});
