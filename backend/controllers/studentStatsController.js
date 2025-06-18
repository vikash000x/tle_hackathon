// server/controllers/studentStatsController.js

const ContestData = require('../models/ContestData');
const ProblemStats = require('../models/ProblemStats');
const mongoose = require('mongoose');
const { computeStatsFromSubmissions } = require('../utils/analytics');

// Utility to calculate date range
const getStartDate = (range) => {
  const days = parseInt(range);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// 🎯 GET /api/students/:id/contest-data?range=30
exports.getContestData = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = 90 } = req.query;
    const fromDate = getStartDate(range);

    

    const data = await ContestData.findOne({ student: id });
  

    if (!data) return res.status(404).json({ message: 'Contest data not found' });

    const filteredContests = data.contests.filter(contest => new Date(contest.date) >= fromDate);
    
    const ratingData = filteredContests.map(c => ({
      date: c.date,
      rating: c.newRating,
    }));

 

    res.json({ ratingData, contests: filteredContests });
  } catch (err) {
   
    res.status(500).json({ error: 'Server error' });
  }
};

// 🎯 GET /api/students/:id/problem-stats?range=30
exports.getProblemStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = 30 } = req.query;
    const rangeKey = `${range}days`;

 

    const stats = await ProblemStats.findOne({ student: id, timeRange: rangeKey });

    if (!stats)
{
  console.log("No stats found for this range, computing from submissions...");
  // If no stats found, compute from submissions
  const spstats = computeStatsFromSubmissions(id, range);

  // If computed stats are empty, return 404

  if(!spstats){
   return res.status(404).json({ message: 'Problem stats not found' });
   console.log("No stats computed for this range");
}
 else  if (spstats) {     
    // Create new stats document if it doesn't exist
    console.log("Creating new stats document...");
    console.log("spstats mil gya db me store ke liye");
 
    const newStats = new ProblemStats({
      student: id,
      timeRange: rangeKey,
      ...spstats
    });
    await newStats.save();
    console.log("New stats saved to DB:");
    return res.json({
      totalSolved: spstats.totalSolved,
      mostDifficult: spstats.mostDifficultProblem,
      avgRating: spstats.averageRating,
      avgPerDay: spstats.averageProblemsPerDay,
      ratingBuckets: spstats.solvedPerRatingBucket,
      submissionHeatmap: spstats.heatmapData
    });
  }
}
    console.log("Stats found in DB:");
    // If stats found, return them
     

    res.json({
      totalSolved: stats.totalSolved,
      mostDifficult: stats.mostDifficultProblem,
      avgRating: stats.averageRating,
      avgPerDay: stats.averageProblemsPerDay,
      ratingBuckets: stats.solvedPerRatingBucket,
      submissionHeatmap: stats.heatmapData
    });
  } catch (err) {
    console.error('Error in getProblemStats:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
