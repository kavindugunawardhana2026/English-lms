const express = require('express');
const router = express.Router();
const {
  addPaperMark,
  getPaperMarks,
  getMarksAnalytics,
  getMyMarks
} = require('../controllers/markController');

const { protect, authorize } = require('../middleware/auth');

router.route('/paper')
  .post(protect, authorize('teacher'), addPaperMark)
  .get(protect, authorize('teacher'), getPaperMarks);

router.route('/analytics')
  .get(protect, authorize('teacher'), getMarksAnalytics);

router.route('/me')
  .get(protect, getMyMarks);

module.exports = router;
