import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale, ArcElement, PointElement, LineElement,
  Filler, Tooltip, Legend,
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

ChartJS.register(RadialLinearScale, ArcElement, PointElement, LineElement, Filler, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  fill_blank: 'Fill in Blank',
  matching: 'Matching',
  word_search: 'Word Search',
  sorting: 'Sorting',
  sentence_build: 'Sentence Build',
};

const TYPE_ICONS = {
  multiple_choice: '📝', fill_blank: '✏️', matching: '🔗',
  word_search: '🔍', sorting: '📂', sentence_build: '🔤',
};

const StatBlock = ({ label, value, colorClass }) => (
  <div className="flex flex-col items-center p-4">
    <p className={`text-3xl font-display font-bold ${colorClass}`}>{value}</p>
    <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/exercises/stats/me`)
      .then(res => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const typeBreakdown = {};
  (stats?.recentAttempts || []).forEach(a => {
    const t = a.exercise?.type;
    if (!t) return;
    if (!typeBreakdown[t]) typeBreakdown[t] = { count: 0, total: 0 };
    typeBreakdown[t].count++;
    typeBreakdown[t].total += a.score;
  });

  const radarLabels = Object.keys(typeBreakdown).map(t => TYPE_LABELS[t] || t);
  const radarData = Object.values(typeBreakdown).map(v => Math.round(v.total / v.count));

  const doughnutLabels = Object.keys(typeBreakdown).map(t => TYPE_LABELS[t] || t);
  const doughnutData = Object.values(typeBreakdown).map(v => v.count);
  const doughnutColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A';

  return (
    <div className="container-xl section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* User Header Profile Card */}
        <div className="card relative overflow-hidden bg-gradient-to-br from-indigo-900 to-violet-950 !p-0 border-0 shadow-xl text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/30 rounded-full blur-[80px]" />
          
          <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative group cursor-pointer shrink-0">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 p-1">
                <div className="h-full w-full rounded-full bg-indigo-950 flex items-center justify-center text-4xl font-display font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-3xl font-display font-bold">{user?.name}</h1>
                <p className="text-indigo-200">{user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="badge bg-white/20 text-white border border-white/20 backdrop-blur-sm capitalize">
                  {user?.role}
                </span>
                {user?.grade && (
                  <span className="badge bg-indigo-500 text-white border border-indigo-400">
                    Grade {user.grade}
                  </span>
                )}
                <span className="badge bg-black/20 text-indigo-100 border border-black/10">
                  Joined {joinDate}
                </span>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl transition-all backdrop-blur-md self-center sm:self-start"
            >
              Sign Out
            </button>
          </div>

          {/* Stats Bar Integrated into Header */}
          <div className="relative z-10 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/20 backdrop-blur-md">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-24 opacity-50 animate-pulse bg-white/5" />)
            ) : (
              <>
                <StatBlock label="Total Attempts" value={stats?.totalAttempts ?? 0} colorClass="text-indigo-100" />
                <StatBlock label="Avg Score" value={`${stats?.avgScore ?? 0}%`} colorClass="text-emerald-400" />
                <StatBlock label="Types Played" value={Object.keys(typeBreakdown).length} colorClass="text-violet-300" />
              </>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {!loading && radarLabels.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Mastery by Skill</h2>
              <div className="aspect-square max-h-80 mx-auto">
                <Radar
                  data={{
                    labels: radarLabels,
                    datasets: [{
                      label: 'Avg Score %',
                      data: radarData,
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      borderColor: '#6366f1',
                      pointBackgroundColor: '#6366f1',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: '#6366f1'
                    }],
                  }}
                  options={{ 
                    responsive: true, maintainAspectRatio: false,
                    scales: { r: { beginAtZero: true, max: 100, ticks: { display: false } } },
                    plugins: { legend: { display: false } } 
                  }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Exercises by Type</h2>
              <div className="aspect-square max-h-80 mx-auto">
                <Doughnut
                  data={{
                    labels: doughnutLabels,
                    datasets: [{
                      data: doughnutData,
                      backgroundColor: doughnutColors,
                      borderWidth: 0,
                      hoverOffset: 10,
                    }],
                  }}
                  options={{ 
                    responsive: true, maintainAspectRatio: false,
                    plugins: { 
                      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20, font: { family: 'Inter' } } }
                    } 
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Detailed History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-display font-bold text-gray-900">Attempt History</h2>
            <Link to="/exercises" className="btn-secondary py-2 px-4 text-sm bg-gray-50 border-gray-200 text-gray-700">
              Practice More &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 skeleton rounded-xl" />
              ))}
            </div>
          ) : !stats?.recentAttempts?.length ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No attempts yet. Take an exercise to see your history!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentAttempts.map((a, i) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  className="group flex flex-wrap items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all gap-4 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 group-hover:bg-indigo-50 transition-colors">
                      {TYPE_ICONS[a.exercise?.type] || '📋'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {a.exercise?.title || 'Unknown Exercise'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {a.timeTaken > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{Math.round(a.timeTaken / 60)}m {a.timeTaken % 60}s</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-auto">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      a.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                      a.score >= 50 ? 'bg-amber-100 text-amber-700' : 
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {a.score}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
