// server/controllers/studentController.js
const Student = require('../models/Student');
const ContestData = require('../models/ContestData');
const ProblemStats = require('../models/ProblemStats');
const { syncCFData } = require('../services/syncService'); // you’ll create this in next step
const { parse } = require('json2csv');

exports.addStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    await syncCFData(student._id); // sync immediately
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const existing = await Student.findById(req.params.id);
    const wasHandleChanged = existing.cfHandle !== req.body.cfHandle;

    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (wasHandleChanged) {
      await syncCFData(updated._id); // re-fetch new handle data
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await ContestData.deleteMany({ student: req.params.id });
    await ProblemStats.deleteMany({ student: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const contestData = await ContestData.findOne({ student: student._id });
    const problemStats = await ProblemStats.find({ student: student._id });

    res.json({ student, contestData, problemStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadCSV = async (req, res) => {
  try {
    const students = await Student.find().lean();
    const csv = parse(students, { fields: ['name', 'email', 'phone', 'cfHandle', 'currentRating', 'maxRating'] });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.status(200).end(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
