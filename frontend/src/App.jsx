import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import ExerciseDetail from './pages/ExerciseDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected — students & teachers */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/exercises" element={
                <ProtectedRoute><Exercises /></ProtectedRoute>
              } />
              <Route path="/exercises/:id" element={
                <ProtectedRoute><ExerciseDetail /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;