// server/models/ContestData.js
const mongoose = require('mongoose');

const ContestDataSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  contests: [
    {
      contestId: Number,
      contestName: String,
      rank: Number,
      ratingChange: Number,
      newRating: Number,
      date: Date,
      unsolvedProblems: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ContestData', ContestDataSchema);

