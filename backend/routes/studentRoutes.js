// server/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { getContestData, getProblemStats } = require('../controllers/studentStatsController');

// CRUD + sync
router.post('/', studentController.addStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/', studentController.getAllStudents);
//router.get('/:id', studentController.getStudentProfile);
router.get('/csv/download', studentController.downloadCSV);
// routes/student.js

// // Route: /api/students/:id/contest-data?range=30
// router.get('/contest-data/:id/hh', getContestData);

// // Route: /api/students/:id/problem-stats?range=30
// router.get('/problem-stats/:id/bb', getProblemStats);
router.get('/:id/contest-data', getContestData);
router.get('/:id/problem-stats', getProblemStats);
router.put('/:id', studentController.updateStudent);
router.get('/:id', studentController.getStudentById);
module.exports = router;
