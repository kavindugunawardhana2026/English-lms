const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByLesson,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getMySubmissions
} = require('../controllers/assignmentController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .post(protect, authorize('teacher'), upload.array('attachments', 5), createAssignment);

router.route('/lesson/:lessonId')
  .get(protect, getAssignmentsByLesson);

router.route('/:id/submit')
  .post(protect, upload.single('submission'), submitAssignment);

router.route('/:id/submissions')
  .get(protect, authorize('teacher'), getAssignmentSubmissions);

router.route('/submissions/:submissionId/grade')
  .put(protect, authorize('teacher'), gradeSubmission);

router.route('/me/submissions')
  .get(protect, getMySubmissions);

module.exports = router;
