import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MultipleChoice = ({ questions, onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];
  const totalQ = questions.length;

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(prev => ({ ...prev, [current]: idx }));
  };

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent(c => c + 1);
      setShowResult(false);
      setSubmitted(false);
    } else {
      // All done — build answers array and call onComplete
      const answers = questions.map((_, i) => selected[i] ?? -1);
      onComplete(answers);
    }
  };

  const handleCheck = () => setSubmitted(true);

  const isCorrect = selected[current] === q.correctIndex;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Question {current + 1} of {totalQ}</span>
        <span>{Math.round(((current) / totalQ) * 100)}% complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(current / totalQ) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg font-semibold text-gray-800 mb-6">{q.question}</p>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let base = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium ';
              if (!submitted) {
                base += selected[current] === i
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-700';
              } else {
                if (i === q.correctIndex) base += 'border-green-500 bg-green-50 text-green-700';
                else if (selected[current] === i) base += 'border-red-400 bg-red-50 text-red-700';
                else base += 'border-gray-200 bg-white text-gray-400';
              }

              return (
                <button key={i} onClick={() => handleSelect(i)} className={base}>
                  <span className="inline-flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs shrink-0
                      border-current">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {submitted && q.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
            >
              <strong>{isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}</strong>
              {q.explanation}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        {!submitted ? (
          <button
            onClick={handleCheck}
            disabled={selected[current] === undefined}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {current < totalQ - 1 ? 'Next →' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;
