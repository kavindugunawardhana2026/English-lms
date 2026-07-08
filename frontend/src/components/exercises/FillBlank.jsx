import { useState } from 'react';
import { motion } from 'framer-motion';

const FillBlank = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const handleChange = (idx, val) => {
    setAnswers(prev => ({ ...prev, [idx]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChecked(true);
  };

  const handleFinish = () => {
    onComplete(questions.map((_, i) => answers[i] || ''));
  };

  const allFilled = questions.every((_, i) => (answers[i] || '').trim() !== '');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-500">Fill in the blank for each sentence.</p>

      {questions.map((q, idx) => {
        const parts = q.sentence.split('___');
        const isCorrect =
          checked &&
          (answers[idx] || '').trim().toLowerCase() === q.answer.trim().toLowerCase();
        const isWrong = checked && !isCorrect;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`p-5 rounded-xl border-2 transition-colors ${
              !checked ? 'border-gray-200 bg-white'
              : isCorrect ? 'border-green-400 bg-green-50'
              : 'border-red-400 bg-red-50'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 text-gray-800 font-medium text-lg">
              <span>{parts[0]}</span>
              <input
                type="text"
                value={answers[idx] || ''}
                onChange={e => handleChange(idx, e.target.value)}
                disabled={checked}
                className={`border-b-2 outline-none text-center min-w-[100px] px-2 py-0.5 bg-transparent transition-colors ${
                  !checked ? 'border-blue-400 focus:border-blue-600'
                  : isCorrect ? 'border-green-500 text-green-700'
                  : 'border-red-400 text-red-700'
                }`}
                placeholder="____________"
              />
              {parts[1] && <span>{parts[1]}</span>}
            </div>

            {checked && (
              <p className="mt-2 text-sm">
                {isCorrect
                  ? <span className="text-green-600">✓ Correct!</span>
                  : <span className="text-red-600">✗ Answer: <strong>{q.answer}</strong></span>
                }
                {q.hint && !isCorrect && (
                  <span className="ml-2 text-gray-500 italic">Hint: {q.hint}</span>
                )}
              </p>
            )}
          </motion.div>
        );
      })}

      <div className="flex justify-end gap-3 pt-2">
        {!checked ? (
          <button
            type="submit"
            disabled={!allFilled}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Check Answers
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Finish Exercise
          </button>
        )}
      </div>
    </form>
  );
};

export default FillBlank;
