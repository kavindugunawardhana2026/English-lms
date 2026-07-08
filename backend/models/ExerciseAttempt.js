const mongoose = require('mongoose');

const exerciseAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  // Raw submitted answers — flexible Mixed type for all exercise types
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  score: {
    type: Number, // 0–100
    required: true,
    min: 0,
    max: 100,
  },
  timeTaken: {
    type: Number, // seconds
    default: 0,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

exerciseAttemptSchema.index({ student: 1, completedAt: -1 });
exerciseAttemptSchema.index({ student: 1, exercise: 1 });

module.exports = mongoose.model('ExerciseAttempt', exerciseAttemptSchema);
