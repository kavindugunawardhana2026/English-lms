const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Lesson = require('../models/Lesson');

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
exports.createAssignment = async (req, res) => {
  try {
    const { lesson, title, description, dueDate, totalMarks } = req.body;
    
    // Process uploaded files if any
    const attachments = req.files ? req.files.map(file => ({
      title: file.originalname,
      fileUrl: `/uploads/${file.filename}`
    })) : [];

    const assignment = await Assignment.create({
      lesson,
      title,
      description,
      dueDate,
      totalMarks,
      attachments
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments by lesson
// @route   GET /api/assignments/lesson/:lessonId
// @access  Private
exports.getAssignmentsByLesson = async (req, res) => {
  try {
    const assignments = await Assignment.find({ lesson: req.params.lessonId, isActive: true });
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Create or update submission
    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignment: req.params.id, student: req.user._id },
      { fileUrl, submittedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get submissions for an assignment (Teacher)
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignment: req.params.id })
      .populate('student', 'name email grade');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Grade a submission
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private/Teacher
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const submission = await AssignmentSubmission.findByIdAndUpdate(
      req.params.submissionId,
      { score, feedback },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get student's own submissions
// @route   GET /api/assignments/me/submissions
// @access  Private/Student
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ student: req.user._id })
      .populate('assignment');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
