const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  youtubeUrl: {
    type: String,
    trim: true,
    default: '',
  },
  materials: [{
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

lessonSchema.index({ unit: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
