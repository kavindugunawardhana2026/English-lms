const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    unique: true,
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
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
