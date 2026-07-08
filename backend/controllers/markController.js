const PaperMark = require('../models/PaperMark');
const ExerciseAttempt = require('../models/ExerciseAttempt');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// @desc    Add manual paper mark
// @route   POST /api/marks/paper
// @access  Private/Teacher
exports.addPaperMark = async (req, res) => {
  try {
    const mark = await PaperMark.create(req.body);
    res.status(201).json({ success: true, data: mark });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all manual paper marks (Teacher)
// @route   GET /api/marks/paper
// @access  Private/Teacher
exports.getPaperMarks = async (req, res) => {
  try {
    const marks = await PaperMark.find()
      .populate('student', 'name email grade')
      .populate('grade', 'title level')
      .sort({ date: -1 });
    res.status(200).json({ success: true, count: marks.length, data: marks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics for Mark Analyze page (Teacher)
// @route   GET /api/marks/analytics
// @access  Private/Teacher
exports.getMarksAnalytics = async (req, res) => {
  try {
    // 1. Get recent paper marks
    const paperMarks = await PaperMark.find()
      .populate('student', 'name email grade')
      .sort({ date: -1 }).limit(50);
      
    // 2. Get recent exercise attempts
    const exerciseAttempts = await ExerciseAttempt.find()
      .populate('student', 'name email grade')
      .populate('exercise', 'title type lesson')
      .sort({ completedAt: -1 }).limit(50);
      
    // 3. Get recent assignment submissions
    const assignmentSubmissions = await AssignmentSubmission.find({ score: { $ne: null } })
      .populate('student', 'name email grade')
      .populate('assignment', 'title totalMarks')
      .sort({ updatedAt: -1 }).limit(50);

    // Provide aggregated data
    const analytics = {
      paperMarks,
      exerciseAttempts,
      assignmentSubmissions
    };

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get student's own marks (all types)
// @route   GET /api/marks/me
// @access  Private/Student
exports.getMyMarks = async (req, res) => {
  try {
    const studentId = req.user._id;

    const paperMarks = await PaperMark.find({ student: studentId }).populate('grade', 'title');
    const exerciseAttempts = await ExerciseAttempt.find({ student: studentId }).populate('exercise', 'title');
    const assignmentSubmissions = await AssignmentSubmission.find({ student: studentId }).populate('assignment', 'title');

    res.status(200).json({
      success: true,
      data: { paperMarks, exerciseAttempts, assignmentSubmissions }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
