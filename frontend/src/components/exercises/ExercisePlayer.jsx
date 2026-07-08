import { useState } from 'react';
import { motion } from 'framer-motion';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import Matching from './Matching';
import WordSearch from './WordSearch';

const ScoreScreen = ({ score, onRetry }) => {
  const emoji = score >= 80 ? '🎉' : score >= 50 ? '👍' : '😅';
  const label = score >= 80 ? 'Excellent!' : score >= 50 ? 'Good effort!' : 'Keep practising!';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10 space-y-6"
    >
      <div className="text-6xl">{emoji}</div>
      <h3 className="text-2xl font-bold text-gray-800">{label}</h3>
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <motion.circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
            strokeWidth="3"
            strokeDasharray={`${score} ${100 - score}`}
            strokeDashoffset="25"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 100' }}
            animate={{ strokeDasharray: `${score} ${100 - score}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
          {score}%
        </span>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );
};

const ExercisePlayer = ({ exercise, onSubmit, submitting }) => {
  const [score, setScore] = useState(null);
  const [answers, setAnswers] = useState(null);

  const handleComplete = async (rawAnswers) => {
    setAnswers(rawAnswers);
    if (onSubmit) {
      const result = await onSubmit(rawAnswers);
      if (result?.score !== undefined) setScore(result.score);
    }
  };

  const handleRetry = () => {
    setScore(null);
    setAnswers(null);
  };

  if (score !== null) {
    return <ScoreScreen score={score} onRetry={handleRetry} />;
  }

  const renderExercise = () => {
    switch (exercise.type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            questions={exercise.multipleChoiceQuestions || []}
            onComplete={handleComplete}
          />
        );
      case 'fill_blank':
        return (
          <FillBlank
            questions={exercise.fillBlankQuestions || []}
            onComplete={handleComplete}
          />
        );
      case 'matching':
        return (
          <Matching
            pairs={exercise.matchingPairs || []}
            onComplete={handleComplete}
          />
        );
      case 'word_search':
        return (
          <WordSearch
            config={exercise.wordSearch}
            onComplete={handleComplete}
          />
        );
      default:
        return (
          <p className="text-gray-500 text-center py-8">
            Exercise type <strong>{exercise.type}</strong> is not supported yet.
          </p>
        );
    }
  };

  return (
    <div>
      {submitting && (
        <div className="text-center text-sm text-blue-600 mb-4 animate-pulse">
          Saving your attempt…
        </div>
      )}
      {renderExercise()}
    </div>
  );
};

export default ExercisePlayer;
