import { useState, useEffect, useRef } from 'react';
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
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -6, scale: 1.01 }}
    className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
  >
    {/* Decorative soft glowing corner */}
    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${bgGradient} blur-2xl`} />
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 transition-transform duration-500 group-hover:scale-110 ${bgGradient}`} />
    
    <div className="relative z-10 flex justify-between items-start mb-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${bgGradient} text-white transform group-hover:-rotate-6 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="text-right">
        <h3 className={`text-3xl md:text-4xl font-display font-extrabold tracking-tight ${textClass}`}>{value}</h3>
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className={`flex items-center justify-center w-5 h-5 rounded-full ${bgGradient} text-white text-[10px] bg-opacity-20`}>
          ✦
        </span>
        <p className="text-xs font-medium text-gray-400">{sub}</p>
      </div>
    </div>
  </motion.div>
);

const TYPE_ICONS = {
  multiple_choice: '📝', fill_blank: '✏️', matching: '🔗',
  word_search: '🔍', sorting: '📂', sentence_build: '🔤',
};

// Creates a gradient for charts dynamically
const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, colorEnd);
  gradient.addColorStop(1, colorStart);
  return gradient;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/exercises/stats/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Added auth header just in case, though original missed it, usually handled via interceptor. If interceptor is used, this is harmless.
    })
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
      {/* Premium Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 sm:p-12 mb-12 shadow-2xl"
      >
        {/* Abstract animated orbs for premium feel */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-violet-600 opacity-20 blur-[100px] animate-pulse mix-blend-screen pointer-events-none" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-[100px] animate-pulse mix-blend-screen pointer-events-none" style={{ animationDuration: '5s' }} />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Dashboard Active</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
              Welcome back,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                {user?.name?.split(' ')[0] || 'Learner'}
              </span> ✨
            </h1>
            <p className="text-indigo-100/80 text-lg sm:text-xl font-medium max-w-lg leading-relaxed">
              {user?.grade ? `Grade ${user.grade} Student` : 'Teacher'} • Your learning journey is looking great today. Let's keep the momentum going!
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="shrink-0"
          >
            <Link to="/exercises" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-950 font-bold rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 hover:scale-105 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Start Learning
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 skeleton rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Exercises"
            value={stats?.totalAttempts ?? 0}
            sub="All time completions"
            icon="📚"
            bgGradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            textClass="text-indigo-950"
            delay={0.1}
          />
          <StatCard
            label="Average Score"
            value={`${stats?.avgScore ?? 0}%`}
            sub="Across all attempts"
            icon="🎯"
            bgGradient="bg-gradient-to-br from-emerald-400 to-teal-500"
            textClass="text-teal-900"
            delay={0.2}
          />
          <StatCard
            label="This Week"
            value={weekCounts.reduce((a, b) => a + b, 0)}
            sub="Exercises completed"
            icon="⚡"
            bgGradient="bg-gradient-to-br from-violet-500 to-purple-600"
            textClass="text-purple-950"
            delay={0.3}
          />
          <StatCard
            label="Grade Level"
            value={user?.grade || '—'}
            sub={user?.role === 'teacher' ? 'Teacher Account' : 'Current Curriculum'}
            icon="🎓"
            bgGradient="bg-gradient-to-br from-amber-400 to-orange-500"
            textClass="text-orange-950"
            delay={0.4}
          />
        </div>
      )}

      {/* Charts Row */}
      {stats && (
        <div className="grid gap-8 mb-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Activity Pulse</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Exercises completed this week</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                📊
              </div>
            </div>
            <div className="h-72">
              <Bar
                data={{
                  labels: weekLabels,
                  datasets: [{
                    label: 'Exercises',
                    data: weekCounts,
                    backgroundColor: (context) => {
                      const chart = context.chart;
                      const {ctx, chartArea} = chart;
                      if (!chartArea) return 'rgba(99, 102, 241, 0.8)';
                      return createGradient(ctx, chartArea, 'rgba(99, 102, 241, 0.8)', 'rgba(168, 85, 247, 0.8)');
                    },
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 24,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false }, 
                    tooltip: { 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      padding: 12, 
                      borderRadius: 12,
                      titleFont: { size: 14, family: "'Plus Jakarta Sans', sans-serif" },
                      bodyFont: { size: 14, family: "'Plus Jakarta Sans', sans-serif", weight: 'bold' },
                      displayColors: false
                    } 
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true, 
                      ticks: { stepSize: 1, color: '#94a3b8', font: { family: "'Inter', sans-serif" } }, 
                      grid: { color: '#f1f5f9', drawBorder: false } 
                    },
                    x: { 
                      ticks: { color: '#64748b', font: { family: "'Inter', sans-serif", weight: '500' } }, 
                      grid: { display: false, drawBorder: false } 
                    }
                  },
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Performance Trend</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Average score over last 7 days</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                📈
              </div>
            </div>
            <div className="h-72">
              <Line
                data={{
                  labels: weekLabels,
                  datasets: [{
                    label: 'Avg Score %',
                    data: weekScores,
                    borderColor: '#10b981',
                    borderWidth: 4,
                    backgroundColor: (context) => {
                      const chart = context.chart;
                      const {ctx, chartArea} = chart;
                      if (!chartArea) return 'rgba(16, 185, 129, 0.1)';
                      return createGradient(ctx, chartArea, 'rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.0)');
                    },
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#10b981',
                    pointBorderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#10b981',
                    pointHoverBorderColor: '#ffffff',
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false }, 
                    tooltip: { 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      padding: 12, 
                      borderRadius: 12,
                      titleFont: { size: 14, family: "'Plus Jakarta Sans', sans-serif" },
                      bodyFont: { size: 14, family: "'Plus Jakarta Sans', sans-serif", weight: 'bold' },
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          return context.parsed.y + '%';
                        }
                      }
                    } 
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true, 
                      max: 100, 
                      ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" }, callback: (value) => value + '%' }, 
                      grid: { color: '#f1f5f9', drawBorder: false } 
                    },
                    x: { 
                      ticks: { color: '#64748b', font: { family: "'Inter', sans-serif", weight: '500' } }, 
                      grid: { display: false, drawBorder: false } 
                    }
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-display font-bold text-gray-900">Recent Activity</h2>
            </div>
            <Link to="/profile" className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              View all history 
              <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 skeleton rounded-2xl" />
              ))}
            </div>
          ) : !stats?.recentAttempts?.length ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm mb-6 animate-bounce">
                🌱
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">No exercises completed yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-center font-medium">
                Your learning journey starts here. Take your first exercise to see your activity populate.
              </p>
              <Link to="/exercises" className="btn-primary shadow-lg shadow-indigo-200">Take First Exercise</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentAttempts.map((attempt, i) => (
                <motion.div
                  key={attempt._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.4 }}
                  whileHover={{ scale: 1.01, backgroundColor: '#ffffff' }}
                  className="group flex items-center justify-between p-5 sm:p-6 bg-white/80 backdrop-blur-sm rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-center text-2xl group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
                      {TYPE_ICONS[attempt.exercise?.type] || '📋'}
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {attempt.exercise?.title || 'Unknown Exercise'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase tracking-wide">
                          {attempt.exercise?.type?.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end pl-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${
                        attempt.score >= 80 ? 'text-emerald-500' : 
                        attempt.score >= 50 ? 'text-amber-500' : 
                        'text-rose-500'
                      }`}>
                        {attempt.score}
                      </span>
                      <span className="text-sm font-bold text-gray-400">%</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Score</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions Sidebar */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-display font-bold text-gray-900">Explore</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { to: '/exercises', icon: '📖', label: 'All Exercises', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200', sub: 'Practice any topic to improve' },
              { to: '/exercises?type=word_search', icon: '🔍', label: 'Play Word Search', color: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-200', sub: 'Fun vocabulary builder game' },
              { to: '/profile', icon: '📈', label: 'Full Progress', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200', sub: 'Detailed analysis of your skills' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 0.4 }}
              >
                <Link
                  to={item.to}
                  className="group block relative overflow-hidden bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-white rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-lg ${item.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-display font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{item.label}</p>
                      <p className="text-sm font-medium text-gray-500 mt-1 leading-snug">{item.sub}</p>
                    </div>
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