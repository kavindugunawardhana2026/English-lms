import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('video');
  
  const tabs = [
    { id: 'video', label: 'Video Lectures', icon: '🎥' },
    { id: 'documents', label: 'Materials', icon: '📄' },
    { id: 'quizzes', label: 'Quizzes', icon: '📝' },
    { id: 'assignments', label: 'Assignments', icon: '📂' },
    { id: 'live', label: 'Live Classes', icon: '🔴' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Content Manager</h1>
        <p className="text-gray-500">Manage rich content for a specific lesson or unit.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area (Placeholder for actual forms) */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]"
      >
        {activeTab === 'video' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Add Video Lecture</h2>
            <input type="text" className="input mb-4" placeholder="YouTube Video URL..." />
            <button className="btn-primary">Save Video</button>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Upload Materials (PDFs/Notes)</h2>
            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-4" />
            <button className="btn-primary">Upload Document</button>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold text-gray-900">Quiz Builder</h3>
            <p className="text-gray-500 mb-6">Create multiple choice, fill in the blanks, or matching quizzes.</p>
            <button className="btn-primary">Launch Quiz Builder</button>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Create Assignment</h2>
            <div className="space-y-4 max-w-md">
              <input type="text" className="input" placeholder="Assignment Title" />
              <textarea className="input" placeholder="Description"></textarea>
              <input type="date" className="input" />
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <button className="btn-primary">Publish Assignment</button>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Schedule Live Class</h2>
            <div className="space-y-4 max-w-md">
              <input type="text" className="input" placeholder="Session Title" />
              <input type="datetime-local" className="input" />
              <input type="text" className="input" placeholder="Meeting URL (Zoom/Teams)" />
              <button className="btn-primary">Schedule Session</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContentManager;
