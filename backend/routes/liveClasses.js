const express = require('express');
const router = express.Router();
const {
  createLiveClass,
  getLiveClassesByUnit,
  updateLiveClass,
  deleteLiveClass
} = require('../controllers/liveClassController');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('teacher'), createLiveClass);

router.route('/unit/:unitId')
  .get(protect, getLiveClassesByUnit);

router.route('/:id')
  .put(protect, authorize('teacher'), updateLiveClass)
  .delete(protect, authorize('teacher'), deleteLiveClass);

module.exports = router;
