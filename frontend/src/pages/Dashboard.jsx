import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StatCard = ({ label, value, sub, icon, bgGradient, textClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="card relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${bgGradient}`} />
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className={`text-3xl font-display font-bold ${textClass}`}>{value}</p>
        {sub && <p className="mt-2 text-xs font-medium text-gray-400">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${bgGradient} text-white`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const TYPE_ICONS = {
  multiple_choice: '📝', fill_blank: '✏️', matching: '🔗',
  word_search: '🔍', sorting: '📂', sentence_build: '🔤',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/exercises/stats/me`)
      .then(res => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const weekLabels = stats ? Object.keys(stats.weeklyData).map(d => {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short' });
  }) : [];

  const weekCounts = stats ? Object.values(stats.weeklyData).map(d => d.count) : [];
  const weekScores = stats ? Object.values(stats.weeklyData).map(d =>
    d.count > 0 ? Math.round(d.totalScore / d.count) : 0
  ) : [];

  return (
    <div className="container-xl section">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              {user?.grade ? `Grade ${user.grade} Student` : 'Teacher'} • Let's see your learning progress.
            </p>
          </div>
          <Link to="/exercises" className="btn-primary shrink-0 self-start md:self-auto">
            Start Learning
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </motion.header>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Exercises Done"
            value={stats?.totalAttempts ?? 0}
            sub="All time completions"
            icon="📚"
            bgGradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            textClass="text-gray-900"
            delay={0.1}
          />
          <StatCard
            label="Average Score"
            value={`${stats?.avgScore ?? 0}%`}
            sub="Across all attempts"
            icon="🎯"
            bgGradient="bg-gradient-to-br from-emerald-400 to-teal-500"
            textClass="text-emerald-600"
            delay={0.2}
          />
          <StatCard
            label="This Week"
            value={weekCounts.reduce((a, b) => a + b, 0)}
            sub="Exercises completed"
            icon="⚡"
            bgGradient="bg-gradient-to-br from-violet-500 to-purple-600"
            textClass="text-violet-600"
            delay={0.3}
          />
          <StatCard
            label="Grade Level"
            value={user?.grade || '—'}
            sub={user?.role === 'teacher' ? 'Teacher Account' : 'Current Curriculum'}
            icon="🎓"
            bgGradient="bg-gradient-to-br from-amber-400 to-orange-500"
            textClass="text-orange-600"
            delay={0.4}
          />
        </div>
      )}

      {/* Charts Row */}
      {stats && (
        <div className="grid gap-6 mb-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <h2 className="text-lg font-display font-semibold text-gray-900 mb-6">Weekly Activity</h2>
            <div className="h-64">
              <Bar
                data={{
                  labels: weekLabels,
                  datasets: [{
                    label: 'Exercises',
                    data: weekCounts,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
                    borderRadius: 6,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e1b4b', padding: 12, borderRadius: 8 } },
                  scales: { 
                    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#9ca3af' }, grid: { color: '#f3f4f6' } },
                    x: { ticks: { color: '#6b7280' }, grid: { display: false } }
                  },
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-lg font-display font-semibold text-gray-900 mb-6">Average Score (Last 7 Days)</h2>
            <div className="h-64">
              <Line
                data={{
                  labels: weekLabels,
                  datasets: [{
                    label: 'Avg Score %',
                    data: weekScores,
                    borderColor: '#10b981',
                    borderWidth: 3,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e1b4b', padding: 12, borderRadius: 8 } },
                  scales: { 
                    y: { beginAtZero: true, max: 100, ticks: { color: '#9ca3af' }, grid: { color: '#f3f4f6' } },
                    x: { ticks: { color: '#6b7280' }, grid: { display: false } }
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Lower section: Recent Activity & Actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Recent Attempts */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/profile" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View all history &rarr;</Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 skeleton rounded-xl" />
              ))}
            </div>
          ) : !stats?.recentAttempts?.length ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-gray-900 font-medium text-lg">No exercises completed yet.</p>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Your journey starts here. Take your first exercise to see your activity populate.</p>
              <Link to="/exercises" className="btn-primary">Take First Exercise</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentAttempts.map((attempt, i) => (
                <motion.div
                  key={attempt._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="group flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                      {TYPE_ICONS[attempt.exercise?.type] || '📋'}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                        {attempt.exercise?.title || 'Unknown Exercise'}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-lg font-bold ${attempt.score >= 80 ? 'text-emerald-500' : attempt.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {attempt.score}%
                    </span>
                    <span className="text-xs font-medium text-gray-400">Score</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions Sidebar */}
        <section>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">Explore</h2>
          <div className="flex flex-col gap-4">
            {[
              { to: '/exercises', icon: '📖', label: 'All Exercises', color: 'from-blue-500 to-indigo-600', sub: 'Practice any topic' },
              { to: '/exercises?type=word_search', icon: '🔍', label: 'Play Word Search', color: 'from-violet-500 to-purple-600', sub: 'Fun vocabulary builder' },
              { to: '/profile', icon: '📈', label: 'Full Progress', color: 'from-emerald-400 to-teal-500', sub: 'Detailed analysis' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <Link
                  to={item.to}
                  className="card group flex items-center gap-4 !p-5 hover:border-indigo-200"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;