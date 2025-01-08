// models/User.js
const mongoose = require('mongoose');
const deviceSessionSchema = require('./Device');
const flaggedSchema = require('./Flagged');
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  taskName: String,
  dueDate: Date,
  time: String,
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  completed: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const trackingSchema = new mongoose.Schema({
  page: { type: String, required: true },
  pageId: { type: String, default: null },
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  socketId: { type: String, required: true }, // Add socketId for better management
});


const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  adminAuthorization: {type: Boolean, default: false},
  picture: { type: String },
  isActive: { type: Boolean, default: false }, // Default to false for new users
  accessUntil: { type: Date },
  currentSession: deviceSessionSchema,
  loginHistory: [{
    deviceInfo: {
      browser: String,
      os: String,
    },
    ip: {type:String, default: "not available"},
    loginTime: { type: Date, default: Date.now },
    logoutTime: Date,
  }],
  courseSelection: [
    {
      courseName: { type: String, required: true },
      expiryDate: { type: Date, required: true },
    },
  ],
  todos: [todoSchema],
  registeredIp :{type: String},
  streak: {
    streakCount: { type: Number, default: 0 },
    longestCount: { type: Number, default: 0 },
    lastActivity: { type: Date, default: null },
    activity: [
      {
        day: { type: String },
        date: { type: String },
        active: { type: Boolean },
      },
    ],
  },
  flagged: flaggedSchema,
  tracking: [trackingSchema],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
