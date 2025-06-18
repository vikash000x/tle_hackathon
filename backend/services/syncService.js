// server/services/syncService.js
const axios = require('axios');
const Student = require('../models/Student');
const ContestData = require('../models/ContestData');
const ProblemStats = require('../models/ProblemStats');
const {
  computeStatsFromSubmissions,
  getLastSubmissionDate
} = require('../utils/analytics');
const { sendReminderEmail } = require('./emailService');

exports.syncCFData = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) return;

    const handle = student.cfHandle;

    // 1. Fetch user info
    const { data: userInfoRes } = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    const user = userInfoRes.result[0];

    student.currentRating = user.rating || 0;
    student.maxRating = user.maxRating || 0;
    student.lastSyncedAt = new Date();
    await student.save();

    // 2. Fetch contest history
    const { data: contestsRes } = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const contests = contestsRes.result.map(contest => ({
      contestId: contest.contestId,
      contestName: contest.contestName,
      rank: contest.rank,
      ratingChange: contest.newRating - contest.oldRating,
      newRating: contest.newRating,
      date: new Date(contest.ratingUpdateTimeSeconds * 1000),
      unsolvedProblems: 0 // placeholder
    }));
    await ContestData.findOneAndUpdate(
      { student: student._id },
      { student: student._id, contests },
      { upsert: true }
    );

    // 3. Fetch submissions
    const { data: subsRes } = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`);
    const submissions = subsRes.result;

    const allStats1 = computeStatsFromSubmissions(submissions, 7);
    const allStats2 = computeStatsFromSubmissions(submissions, 30);
    const allStats3 = computeStatsFromSubmissions(submissions, 90);

    console.log("stat for 7 days:");
    console.log("stat for 30 days:");
    console.log("stat for 90 days:");



    await ProblemStats.findOneAndUpdate(
      { student: student._id, timeRange: '7days' },
      { ...allStats1, student: student._id },
      { upsert: true }
    );
    await ProblemStats.findOneAndUpdate(
      { student: student._id, timeRange: '30days' },
      { ...allStats2, student: student._id },
      { upsert: true }
    );
    await ProblemStats.findOneAndUpdate(
      { student: student._id, timeRange: '90days' },
      { ...allStats3, student: student._id },
      { upsert: true }
    );

    // 4. Inactivity Detection & Email Notification
    const lastAccepted = getLastSubmissionDate(submissions);
    const daysSinceLast = lastAccepted ? (Date.now() - lastAccepted.getTime()) / (1000 * 60 * 60 * 24) : Infinity;

    if (daysSinceLast > 7 && !student.emailOptOut) {
      await sendReminderEmail(student.email, student.name);
      student.reminderCount = (student.reminderCount || 0) + 1;
      await student.save();
    }

    console.log(`✅ Synced ${student.name}`);
  } catch (err) {
    console.error(`❌ CF Sync Failed for studentId ${studentId}:`, err.message);
  }
};
