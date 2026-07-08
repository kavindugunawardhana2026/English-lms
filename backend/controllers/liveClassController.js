const LiveClass = require('../models/LiveClass');

// @desc    Create new live class
// @route   POST /api/live-classes
// @access  Private/Teacher
exports.createLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.create(req.body);
    res.status(201).json({ success: true, data: liveClass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get live classes by unit
// @route   GET /api/live-classes/unit/:unitId
// @access  Private
exports.getLiveClassesByUnit = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({ unit: req.params.unitId, isActive: true })
      .sort({ startTime: 1 });
    res.status(200).json({ success: true, count: liveClasses.length, data: liveClasses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update live class
// @route   PUT /api/live-classes/:id
// @access  Private/Teacher
exports.updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    res.status(200).json({ success: true, data: liveClass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete live class
// @route   DELETE /api/live-classes/:id
// @access  Private/Teacher
exports.deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndDelete(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
