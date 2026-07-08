import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ExercisePlayer from '../components/exercises/ExercisePlayer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  fill_blank: 'Fill in the Blank',
  matching: 'Matching',
  word_search: 'Word Search',
  sorting: 'Sorting',
  sentence_build: 'Sentence Builder',
};

const DIFF_COLORS = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-rose-100 text-rose-700 border-rose-200',
};

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/exercises/${id}`);
        setExercise(res.data.data);
        startTime.current = Date.now();
      } catch {
        setError('Exercise not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (answers) => {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    try {
      const res = await axios.post(`${API_BASE}/exercises/${id}/attempt`, {
        answers,
        timeTaken,
      });
      return res.data.data; // { attempt, score }
    } catch (err) {
      console.error('Submit error', err);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-xl section max-w-4xl">
        <div className="h-6 w-32 skeleton rounded mb-8" />
        <div className="card !p-0">
          <div className="h-24 skeleton border-b border-gray-100" />
          <div className="h-96 skeleton bg-white/50" />
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="container-xl section text-center">
        <div className="max-w-md mx-auto card py-16">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-rose-600 font-medium text-lg mb-6">{error || 'Exercise not found.'}</p>
          <Link to="/exercises" className="btn-secondary">← Back to Library</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl section max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm font-medium text-gray-400 mb-8 px-2">
          <Link to="/exercises" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Library
          </Link>
          <span>/</span>
          <span className="text-indigo-600 truncate max-w-[200px] sm:max-w-md">{exercise.title}</span>
        </div>

        {/* Main Quiz Container */}
        <div className="card !p-0 overflow-hidden bg-white shadow-xl border-0 ring-1 ring-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-white px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-100 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-100/50 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    {TYPE_LABELS[exercise.type]}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-tight">
                  {exercise.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <span className={`badge border ${DIFF_COLORS[exercise.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {exercise.difficulty}
                </span>
                {exercise.timeLimit > 0 && (
                  <span className="badge bg-white text-gray-600 border border-gray-200 shadow-sm flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {Math.round(exercise.timeLimit / 60)}m
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Exercise Player */}
          <div className="p-6 sm:p-10 bg-white">
            <ExercisePlayer
              exercise={exercise}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default ExerciseDetail;
