import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  fill_blank: 'Fill in the Blank',
  matching: 'Matching',
  word_search: 'Word Search',
  sorting: 'Sorting',
  sentence_build: 'Sentence Builder',
};

const TYPE_ICONS = {
  multiple_choice: '📝',
  fill_blank: '✏️',
  matching: '🔗',
  word_search: '🔍',
  sorting: '📂',
  sentence_build: '🔤',
};

const DIFF_COLORS = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-rose-100 text-rose-700 border-rose-200',
};

const Exercises = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get(`${API_BASE}/exercises`);
        setExercises(res.data.data || []);
      } catch (err) {
        setError('Could not load exercises. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const filtered = typeFilter === 'all'
    ? exercises
    : exercises.filter(e => e.type === typeFilter);

  return (
    <div className="container-xl section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">Practice Library</h1>
          <p className="text-gray-500 text-lg">
            {user?.grade ? `Curated exercises for Grade ${user.grade}` : 'Explore all available exercises'}
          </p>
        </div>

        {/* Filter Tabs (Sliding Pill style) */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gray-100 relative">
          {['all', ...Object.keys(TYPE_LABELS)].map(t => {
            const isActive = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-indigo-600 rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span>{t === 'all' ? '📚' : TYPE_ICONS[t]}</span>
                  <span>{t === 'all' ? 'All Exercises' : TYPE_LABELS[t]}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 skeleton rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-center font-medium">
            {error}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any exercises matching this category. Try a different filter.</p>
            <button onClick={() => setTypeFilter('all')} className="mt-6 btn-secondary bg-gray-50 text-gray-700">Clear Filters</button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((ex, i) => (
                <motion.div
                  key={ex._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={`/exercises/${ex._id}`}
                    className="card group !p-0 flex flex-col h-full border-gray-100 hover:border-indigo-200 overflow-hidden"
                  >
                    <div className="p-6 flex-1 bg-white relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500 z-0" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center text-3xl group-hover:shadow-md transition-all">
                            {TYPE_ICONS[ex.type] || '📋'}
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${DIFF_COLORS[ex.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                            {ex.difficulty}
                          </span>
                        </div>
                        
                        <h3 className="font-display font-bold text-gray-900 text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                          {ex.title}
                        </h3>
                        <p className="text-sm font-medium text-indigo-400 mb-1">{TYPE_LABELS[ex.type]}</p>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group-hover:bg-indigo-50/50 transition-colors">
                      <div className="text-xs font-semibold text-gray-500">
                        {ex.timeLimit > 0 ? `⏱ ${Math.round(ex.timeLimit / 60)} min` : 'No time limit'}
                      </div>
                      <div className="inline-flex items-center gap-1 text-indigo-600 text-sm font-bold group-hover:gap-2 transition-all">
                        Start <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Exercises;
