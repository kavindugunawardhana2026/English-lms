const Grade = require('../models/Grade');
const Unit = require('../models/Unit');
const Lesson = require('../models/Lesson');

// ─── GRADES ───────────────────────────────────────────────

// GET /api/content/grades
exports.getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ isActive: true }).sort('level');
    res.json({ success: true, data: grades });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/content/grades  (teacher only)
exports.createGrade = async (req, res) => {
  try {
    const { level, title, description } = req.body;
    const grade = await Grade.create({ level, title, description });
    res.status(201).json({ success: true, data: grade });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/content/grades/:id  (teacher only)
exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!grade) return res.status(404).json({ success: false, message: 'Grade not found' });
    res.json({ success: true, data: grade });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UNITS ────────────────────────────────────────────────

// GET /api/content/grades/:gradeLevel/units
exports.getUnits = async (req, res) => {
  try {
    const { gradeLevel } = req.params;
    const units = await Unit.find({ gradeLevel: Number(gradeLevel), isActive: true }).sort('order');
    res.json({ success: true, data: units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/content/units  (teacher only)
exports.createUnit = async (req, res) => {
  try {
    const { gradeId, gradeLevel, title, description, order } = req.body;
    const unit = await Unit.create({ grade: gradeId, gradeLevel, title, description, order });
    res.status(201).json({ success: true, data: unit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/content/units/:id  (teacher only)
exports.updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });
    res.json({ success: true, data: unit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── LESSONS ──────────────────────────────────────────────

// GET /api/content/units/:unitId/lessons
exports.getLessons = async (req, res) => {
  try {
    const { unitId } = req.params;
    const lessons = await Lesson.find({ unit: unitId, isActive: true }).sort('order');
    res.json({ success: true, data: lessons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/content/lessons/:id
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('unit');
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, data: lesson });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/content/lessons  (teacher only)
exports.createLesson = async (req, res) => {
  try {
    const { unitId, title, content, youtubeUrl, order } = req.body;
    const lesson = await Lesson.create({ unit: unitId, title, content, youtubeUrl, order });
    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/content/lessons/:id  (teacher only)
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
