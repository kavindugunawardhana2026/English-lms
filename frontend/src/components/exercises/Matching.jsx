import { useState } from 'react';
import { motion } from 'framer-motion';

const Matching = ({ pairs, onComplete }) => {
  const [selected, setSelected] = useState(null); // { side: 'left'|'right', index: number }
  const [matches, setMatches] = useState({}); // { leftIndex: rightIndex }
  const [checked, setChecked] = useState(false);

  // Shuffle right side for display
  const [rightOrder] = useState(() =>
    [...pairs.map((_, i) => i)].sort(() => Math.random() - 0.5)
  );

  const leftConnected = (i) => matches[i] !== undefined;
  const rightConnected = (ri) => Object.values(matches).includes(ri);

  const handleClick = (side, idx) => {
    if (checked) return;

    if (!selected) {
      setSelected({ side, idx });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, idx });
      return;
    }

    // Make a match
    const leftIdx = side === 'right' ? selected.idx : idx;
    const rightOrigIdx = side === 'right' ? idx : selected.idx;

    setMatches(prev => {
      // Remove any existing match for this left
      const updated = { ...prev };
      updated[leftIdx] = rightOrigIdx;
      return updated;
    });
    setSelected(null);
  };

  const allMatched = Object.keys(matches).length === pairs.length;

  const handleCheck = () => setChecked(true);

  const handleFinish = () => {
    // Build answers array: answers[leftIndex] = right text
    const answers = pairs.map((_, i) =>
      matches[i] !== undefined ? pairs[matches[i]].right : ''
    );
    onComplete(answers);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Click an item on the left, then click its match on the right.</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Column A</p>
          {pairs.map((pair, i) => {
            const isSelected = selected?.side === 'left' && selected?.idx === i;
            const isMatched = leftConnected(i);
            const isCorrect = checked && matches[i] !== undefined && pairs[matches[i]].right === pairs[i].right;
            const isWrong = checked && isMatched && !isCorrect;

            return (
              <motion.button
                key={i}
                whileHover={!checked ? { scale: 1.02 } : {}}
                onClick={() => handleClick('left', i)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  checked
                    ? isCorrect ? 'border-green-400 bg-green-50 text-green-800'
                      : isWrong ? 'border-red-400 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : isSelected ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : isMatched ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {pair.left}
              </motion.button>
            );
          })}
        </div>

        {/* Right column (shuffled) */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Column B</p>
          {rightOrder.map((origIdx) => {
            const pair = pairs[origIdx];
            const isSelected = selected?.side === 'right' && selected?.idx === origIdx;
            const isMatched = rightConnected(origIdx);
            const isCorrect = checked && Object.entries(matches).some(
              ([li, ri]) => Number(ri) === origIdx && pairs[Number(li)].right === pair.right
            );
            const isWrong = checked && isMatched && !isCorrect;

            return (
              <motion.button
                key={origIdx}
                whileHover={!checked ? { scale: 1.02 } : {}}
                onClick={() => handleClick('right', origIdx)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  checked
                    ? isCorrect ? 'border-green-400 bg-green-50 text-green-800'
                      : isWrong ? 'border-red-400 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : isSelected ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : isMatched ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                }`}
              >
                {pair.right}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!allMatched}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Check Matches
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Finish Exercise
          </button>
        )}
      </div>
    </div>
  );
};

export default Matching;
