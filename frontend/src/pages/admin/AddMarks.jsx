import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AddMarks = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    gradeId: '',
    examTitle: '',
    score: '',
    total: '100'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/marks/paper`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Marks added successfully!');
      setFormData({ ...formData, studentId: '', score: '' }); // reset some fields
    } catch (err) {
      alert('Error adding marks: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Add Offline Marks</h1>
        <p className="text-gray-500">Manually input student marks for physical papers or term tests.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label">Student ID (Object ID)</label>
              <input type="text" className="input" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} />
            </div>
            <div>
              <label className="label">Course/Grade ID (Object ID)</label>
              <input type="text" className="input" required value={formData.gradeId} onChange={e => setFormData({...formData, gradeId: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="label">Exam Title</label>
            <input type="text" className="input" required placeholder="e.g., Term 1 Final" value={formData.examTitle} onChange={e => setFormData({...formData, examTitle: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label">Score</label>
              <input type="number" className="input" required min="0" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} />
            </div>
            <div>
              <label className="label">Total Marks</label>
              <input type="number" className="input" required min="1" value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">Save Marks</button>
        </form>
      </div>
    </div>
  );
};

export default AddMarks;
