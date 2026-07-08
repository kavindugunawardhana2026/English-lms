import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Generate a random letter grid and embed words
function buildGrid(words, size = 10) {
  const upperWords = words.map(w => w.toUpperCase());
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '')
  );
  const placed = {};

  const directions = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
  ];

  upperWords.forEach(word => {
    let attempts = 0;
    while (attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startR = Math.floor(Math.random() * size);
      const startC = Math.floor(Math.random() * size);
      const cells = [];
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        const r = startR + dir[0] * i;
        const c = startC + dir[1] * i;
        if (r < 0 || r >= size || c < 0 || c >= size) { fits = false; break; }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) { fits = false; break; }
        cells.push([r, c]);
      }

      if (fits) {
        cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
        placed[word] = cells;
        break;
      }
    }
  });

  // Fill empty cells with random letters
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = alpha[Math.floor(Math.random() * 26)];
    }
  }

  return { grid, placed };
}

const WordSearch = ({ config, onComplete }) => {
  const words = config?.words || [];
  const size = config?.gridSize || 10;

  const { grid, placed } = useMemo(() => buildGrid(words, size), []);

  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentCells, setCurrentCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState({});

  const cellKey = (r, c) => `${r}-${c}`;

  const getCellsBetween = (start, end) => {
    if (!start || !end) return [];
    const dr = Math.sign(end[0] - start[0]);
    const dc = Math.sign(end[1] - start[1]);
    const cells = [];
    let r = start[0], c = start[1];
    while (true) {
      cells.push([r, c]);
      if (r === end[0] && c === end[1]) break;
      r += dr;
      c += dc;
    }
    return cells;
  };

  const handleMouseDown = (r, c) => {
    setSelecting(true);
    setStartCell([r, c]);
    setCurrentCells([[r, c]]);
  };

  const handleMouseEnter = (r, c) => {
    if (!selecting || !startCell) return;
    setCurrentCells(getCellsBetween(startCell, [r, c]));
  };

  const handleMouseUp = () => {
    setSelecting(false);
    if (currentCells.length < 2) { setCurrentCells([]); return; }

    const str = currentCells.map(([r, c]) => grid[r][c]).join('');
    const strRev = str.split('').reverse().join('');

    const match = words.find(w => {
      const uw = w.toUpperCase();
      return uw === str || uw === strRev;
    });

    if (match && !foundWords.includes(match.toUpperCase())) {
      const color = `hsl(${Math.random() * 360}, 70%, 75%)`;
      const newHl = { ...highlightedCells };
      currentCells.forEach(([r, c]) => { newHl[cellKey(r, c)] = color; });
      setHighlightedCells(newHl);
      setFoundWords(prev => [...prev, match.toUpperCase()]);
    }
    setCurrentCells([]);
    setStartCell(null);
  };

  const isSelecting = (r, c) => currentCells.some(([rr, cc]) => rr === r && cc === c);

  const allFound = foundWords.length === words.length;

  return (
    <div className="space-y-6">
      {/* Word list */}
      <div className="flex flex-wrap gap-2">
        {words.map(w => (
          <span
            key={w}
            className={`px-3 py-1 rounded-full text-sm font-semibold border ${
              foundWords.includes(w.toUpperCase())
                ? 'bg-green-100 text-green-700 border-green-300 line-through'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {w}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        className="select-none overflow-x-auto"
        onMouseLeave={() => { setSelecting(false); setCurrentCells([]); }}
      >
        <div
          className="inline-grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${size}, 2rem)` }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const hl = highlightedCells[cellKey(r, c)];
              const sel = isSelecting(r, c);
              return (
                <div
                  key={cellKey(r, c)}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  onMouseUp={handleMouseUp}
                  style={{ backgroundColor: hl || (sel ? '#bfdbfe' : undefined) }}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded cursor-pointer transition-colors
                    ${!hl && !sel ? 'bg-gray-50 hover:bg-blue-100 text-gray-700' : 'text-gray-800'}
                  `}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">Found: {foundWords.length} / {words.length}</p>

      {allFound && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onComplete(foundWords)}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          🎉 All Found! Finish
        </motion.button>
      )}
    </div>
  );
};

export default WordSearch;
