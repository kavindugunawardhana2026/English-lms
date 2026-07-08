import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CourseManager from './CourseManager';
import ContentManager from './ContentManager';
import MarkAnalyze from './MarkAnalyze';
import AddMarks from './AddMarks';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Overview & Marks', icon: '📊' },
    { path: '/admin/courses', label: 'Course Manager', icon: '📚' },
    { path: '/admin/content', label: 'Content Manager', icon: '📝' },
    { path: '/admin/add-marks', label: 'Add Offline Marks', icon: '✍️' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-display font-bold text-indigo-950 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">⚙️</span>
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<MarkAnalyze />} />
          <Route path="/courses" element={<CourseManager />} />
          <Route path="/content" element={<ContentManager />} />
          <Route path="/add-marks" element={<AddMarks />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
