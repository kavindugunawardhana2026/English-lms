import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CourseManager = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newGrade, setNewGrade] = useState({ level: '', title: '', description: '' });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/content/grades`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrades(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/content/grades`, newGrade, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewGrade({ level: '', title: '', description: '' });
      fetchGrades();
    } catch (err) {
      alert('Error creating grade: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Course Manager</h1>
        <p className="text-gray-500">Create and manage Grades (Courses) and their curriculum.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Course (Grade)</h2>
            <form onSubmit={handleCreateGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level (6-11)</label>
                <input type="number" required min="6" max="11" className="input" value={newGrade.level} onChange={e => setNewGrade({...newGrade, level: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input type="text" required className="input" value={newGrade.title} onChange={e => setNewGrade({...newGrade, title: e.target.value})} placeholder="e.g. Grade 6 English" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input min-h-[100px]" value={newGrade.description} onChange={e => setNewGrade({...newGrade, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">Create Course</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {grades.map(grade => (
                <motion.div key={grade._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{grade.title} <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">Grade {grade.level}</span></h3>
                    <p className="text-gray-500 text-sm mt-1">{grade.description}</p>
                  </div>
                  <button className="btn-ghost text-indigo-600">Manage Units &rarr;</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManager;
