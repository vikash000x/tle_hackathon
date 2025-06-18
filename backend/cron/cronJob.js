// server/cron/cronJob.js
const cron = require('node-cron');
const Student = require('../models/Student');
const { syncCFData } = require('../services/syncService');

const scheduleSync = (cronTime) => {
  cron.schedule(cronTime || '0 2 * * *', async () => {
    console.log(`🔄 Running Codeforces Daily Sync...`);
    const students = await Student.find();
    for (let student of students) {
      if(!student.emailOptOut){
      await syncCFData(student._id);
    }
    }
  });
};


module.exports = scheduleSync;
