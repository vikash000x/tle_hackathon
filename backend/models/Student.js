// server/models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  cfHandle: { type: String, required: true, unique: true },
  currentRating: Number,
  maxRating: Number,
  lastSyncedAt: Date,
  reminderCount: { type: Number, default: 0 },
  emailOptOut: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
