const express = require('express');
const router = express.Router();
const ec = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');

// Stats (must come before :id to avoid param conflict)
router.get('/stats/me', protect, ec.getMyStats);

// CRUD
router.get('/', protect, ec.getExercises);
router.get('/:id', protect, ec.getExercise);
router.post('/', protect, authorize('teacher'), ec.createExercise);
router.put('/:id', protect, authorize('teacher'), ec.updateExercise);
router.delete('/:id', protect, authorize('teacher'), ec.deleteExercise);

// Attempts
router.post('/:id/attempt', protect, ec.submitAttempt);
router.get('/:id/attempts', protect, ec.getMyAttempts);

module.exports = router;
