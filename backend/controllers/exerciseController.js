const Exercise = require('../models/Exercise');
const ExerciseAttempt = require('../models/ExerciseAttempt');

// ─── Score helpers ────────────────────────────────────────

function scoreMultipleChoice(questions, answers) {
  if (!questions.length) return 100;
  let correct = 0;
  questions.forEach((q, i) => {
    if (Number(answers[i]) === q.correctIndex) correct++;
  });
  return Math.round((correct / questions.length) * 100);
}

function scoreFillBlank(questions, answers) {
  if (!questions.length) return 100;
  let correct = 0;
  questions.forEach((q, i) => {
    const given = (answers[i] || '').trim().toLowerCase();
    const expected = q.answer.trim().toLowerCase();
    if (given === expected) correct++;
  });
  return Math.round((correct / questions.length) * 100);
}

function scoreMatching(pairs, answers) {
  if (!pairs.length) return 100;
  let correct = 0;
  pairs.forEach((pair, i) => {
    if ((answers[i] || '').trim().toLowerCase() === pair.right.trim().toLowerCase()) correct++;
  });
  return Math.round((correct / pairs.length) * 100);
}

function calculateScore(exercise, answers) {
  switch (exercise.type) {
    case 'multiple_choice':
      return scoreMultipleChoice(exercise.multipleChoiceQuestions, answers);
    case 'fill_blank':
      return scoreFillBlank(exercise.fillBlankQuestions, answers);
    case 'matching':
      return scoreMatching(exercise.matchingPairs, answers);
    case 'word_search':
      // Word search: answers = array of found words
      const total = exercise.wordSearch?.words?.length || 1;
      const found = Array.isArray(answers) ? answers.length : 0;
      return Math.round((found / total) * 100);
    case 'sorting':
      const items = exercise.sortingItems;
      if (!items.length) return 100;
      let sortCorrect = 0;
      items.forEach((item) => {
        if ((answers[item.item] || '').trim().toLowerCase() === item.category.trim().toLowerCase()) sortCorrect++;
      });
      return Math.round((sortCorrect / items.length) * 100);
    case 'sentence_build':
      const sentences = exercise.sentenceBuild;
      if (!sentences.length) return 100;
      let sbCorrect = 0;
      sentences.forEach((s, i) => {
        const given = (answers[i] || '').trim().toLowerCase();
        const expected = s.correctSentence.trim().toLowerCase();
        if (given === expected) sbCorrect++;
      });
      return Math.round((sbCorrect / sentences.length) * 100);
    default:
      return 0;
  }
}

// ─── CRUD ─────────────────────────────────────────────────

// GET /api/exercises?lessonId=...
exports.getExercises = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.lessonId) filter.lesson = req.query.lessonId;
    const exercises = await Exercise.find(filter).populate('lesson', 'title unit').sort('createdAt');
    res.json({ success: true, data: exercises });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/exercises/:id
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).populate('lesson', 'title unit');
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/exercises  (teacher only)
exports.createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/exercises/:id  (teacher only)
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/exercises/:id  (teacher only)
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ATTEMPTS ─────────────────────────────────────────────

// POST /api/exercises/:id/attempt
exports.submitAttempt = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });

    const { answers, timeTaken } = req.body;
    const score = calculateScore(exercise, answers);

    const attempt = await ExerciseAttempt.create({
      student: req.user._id,
      exercise: exercise._id,
      answers,
      score,
      timeTaken: timeTaken || 0,
    });

    res.status(201).json({ success: true, data: { attempt, score } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/exercises/:id/attempts  — current user's attempts for this exercise
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await ExerciseAttempt.find({
      student: req.user._id,
      exercise: req.params.id,
    }).sort('-completedAt');
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/exercises/stats/me  — overall student stats
exports.getMyStats = async (req, res) => {
  try {
    const attempts = await ExerciseAttempt.find({ student: req.user._id })
      .populate('exercise', 'title type')
      .sort('-completedAt');

    const totalAttempts = attempts.length;
    const avgScore = totalAttempts
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0;

    // Weekly data (last 7 days)
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const recentAttempts = attempts.filter(a => new Date(a.completedAt) >= weekAgo);

    // Group by day
    const dailyData = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyData[key] = { count: 0, totalScore: 0 };
    }
    recentAttempts.forEach(a => {
      const key = new Date(a.completedAt).toISOString().slice(0, 10);
      if (dailyData[key]) {
        dailyData[key].count++;
        dailyData[key].totalScore += a.score;
      }
    });

    res.json({
      success: true,
      data: {
        totalAttempts,
        avgScore,
        recentAttempts: attempts.slice(0, 10),
        weeklyData: dailyData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
