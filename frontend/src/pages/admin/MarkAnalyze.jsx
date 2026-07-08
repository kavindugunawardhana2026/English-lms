import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MarkAnalyze = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/marks/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare dummy/aggregate data for charts (mock logic for demonstration)
  const chartData = {
    labels: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [75, 82, 68, 90, 78, 85],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Mark Analytics</h1>
        <p className="text-gray-500">Analyze student performance across exercises, assignments, and offline papers.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Performance by Grade</h2>
          <div className="h-72">
            <Bar 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recent Manual Marks</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900">
                  <tr>
                    <th className="p-3 rounded-tl-lg">Student</th>
                    <th className="p-3">Exam</th>
                    <th className="p-3 rounded-tr-lg">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.paperMarks?.length > 0 ? (
                    analytics.paperMarks.map((mark, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="p-3">{mark.student?.name}</td>
                        <td className="p-3">{mark.examTitle}</td>
                        <td className="p-3 font-bold text-indigo-600">{mark.score}/{mark.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="p-3 text-center text-gray-400">No recent marks found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAnalyze;
