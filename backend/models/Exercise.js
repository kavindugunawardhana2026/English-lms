const mongoose = require('mongoose');

// --- Sub-schemas for each question type ---

const multipleChoiceQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
}, { _id: false });

const fillBlankQuestionSchema = new mongoose.Schema({
  sentence: { type: String, required: true }, // "The cat ___ on the mat"
  answer: { type: String, required: true },
  hint: { type: String, default: '' },
}, { _id: false });

const matchingPairSchema = new mongoose.Schema({
  left: { type: String, required: true },
  right: { type: String, required: true },
}, { _id: false });

const wordSearchSchema = new mongoose.Schema({
  words: [{ type: String, required: true }],
  gridSize: { type: Number, default: 10 },
}, { _id: false });

const sortingItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  category: { type: String, required: true },
}, { _id: false });

const sentenceBuildSchema = new mongoose.Schema({
  words: [{ type: String, required: true }], // shuffled array
  correctSentence: { type: String, required: true },
}, { _id: false });

// --- Main Exercise schema ---

const exerciseSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['multiple_choice', 'fill_blank', 'matching', 'word_search', 'sorting', 'sentence_build'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  timeLimit: {
    type: Number, // seconds, 0 = no limit
    default: 0,
  },
  // Type-specific question data
  multipleChoiceQuestions: [multipleChoiceQuestionSchema],
  fillBlankQuestions: [fillBlankQuestionSchema],
  matchingPairs: [matchingPairSchema],
  wordSearch: wordSearchSchema,
  sortingItems: [sortingItemSchema],
  sentenceBuild: [sentenceBuildSchema],

  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

exerciseSchema.index({ lesson: 1 });
exerciseSchema.index({ type: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
