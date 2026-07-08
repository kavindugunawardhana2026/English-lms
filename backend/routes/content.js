const express = require('express');
const router = express.Router();
const cc = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

// ── Grades ──────────────────────────────────────────
router.get('/grades', protect, cc.getGrades);
router.post('/grades', protect, authorize('teacher'), cc.createGrade);
router.put('/grades/:id', protect, authorize('teacher'), cc.updateGrade);

// ── Units ───────────────────────────────────────────
router.get('/grades/:gradeLevel/units', protect, cc.getUnits);
router.post('/units', protect, authorize('teacher'), cc.createUnit);
router.put('/units/:id', protect, authorize('teacher'), cc.updateUnit);

// ── Lessons ─────────────────────────────────────────
router.get('/units/:unitId/lessons', protect, cc.getLessons);
router.get('/lessons/:id', protect, cc.getLesson);
router.post('/lessons', protect, authorize('teacher'), cc.createLesson);
router.put('/lessons/:id', protect, authorize('teacher'), cc.updateLesson);

module.exports = router;
