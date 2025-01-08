const mongoose = require('mongoose');
const deviceSessionSchema = require('./Device');
const flaggedSchema = new mongoose.Schema({
    flag: { type: Boolean, default: false },
    ipFlag: [
      {
        ip: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    loginFlag: [
      {
        date: { type: String, required: true }, // ISO date string
        devices: [deviceSessionSchema], // Reference the device schema
      },
    ],
  });
module.exports = flaggedSchema
  