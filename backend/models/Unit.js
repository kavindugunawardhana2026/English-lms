const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade',
    required: true,
  },
  gradeLevel: {
    type: Number,
    required: true,
    min: 6,
    max: 11,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

unitSchema.index({ grade: 1, order: 1 });

module.exports = mongoose.model('Unit', unitSchema);
