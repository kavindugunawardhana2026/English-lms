import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '6'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      setError('Please fill in your name and email');
      return;
    }
    setError('');
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      nextStep();
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/auth/register`, formData);
      if (res.data.success) {
        // Automatically log them in after registration
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50/50 to-slate-50 p-4 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-200/40 blur-[100px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-200/40 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-row-reverse z-10 border border-gray-100"
      >
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Create an account</h2>
              <p className="text-gray-500">Join thousands of students learning English.</p>
            </div>

            {/* Stepper dots */}
            <div className="flex gap-2 mb-8 justify-center lg:justify-start">
              <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-indigo-600' : 'w-2 bg-indigo-200'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-indigo-600' : 'w-2 bg-indigo-200'}`} />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative min-h-[220px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="label" htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="email">Email address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@example.com"
                      />
                    </div>
                    <button type="button" onClick={nextStep} className="btn-primary w-full mt-2">
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="label" htmlFor="password">Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="input"
                        placeholder="Create a strong password"
                        minLength="6"
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="grade">Grade Level</label>
                      <div className="relative">
                        <select
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleChange}
                          className="input appearance-none"
                        >
                          {[6, 7, 8, 9, 10, 11].map(g => (
                            <option key={g} value={g}>Grade {g}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={prevStep} className="btn-secondary px-4 py-3 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                            Creating...
                          </span>
                        ) : 'Create Account'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Decorative Image/Gradient */}
        <div className="hidden lg:block lg:w-1/2 relative bg-violet-600 bg-hero-gradient p-12 text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="self-end">
              <span className="badge bg-white/20 text-violet-50 border border-white/20 backdrop-blur-md">Free Forever</span>
            </div>
            
            <div className="mb-10">
              <h3 className="font-display text-4xl font-bold mb-4 leading-tight">Your English journey begins here.</h3>
              <ul className="space-y-4 text-violet-100">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</div>
                  Personalized exercises for Grades 6-11
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</div>
                  Beautiful interactive dashboards
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</div>
                  Track your scores over time
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;