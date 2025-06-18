// server/models/ProblemStats.js
const mongoose = require('mongoose');

const ProblemStatsSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  totalSolved: Number,
  mostDifficultProblem: {
    name: String,
    link: String,
    rating: Number
  },
  averageRating: Number,
  averageProblemsPerDay: Number,
  solvedPerRatingBucket: Object,  // { "800-899": 2, "900-999": 5, ... }
  heatmapData: [                  // For calendar heatmap
    {
      date: String,               // e.g., "2025-06-15"
      count: Number
    }
  ],
  timeRange: String               // "7days", "30days", etc.
}, { timestamps: true });

module.exports = mongoose.model('ProblemStats', ProblemStatsSchema);
