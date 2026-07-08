import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/50 p-4 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-200/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-200/40 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden flex z-10 border border-gray-100"
      >
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <div className="max-w-sm mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold mb-6 shadow-glow">
                KE
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500">Sign in to continue your learning journey.</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label !mb-0" htmlFor="password">Password</label>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Forgot?</a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Decorative Image/Gradient */}
        <div className="hidden lg:block lg:w-1/2 relative bg-indigo-600 bg-hero-gradient p-12 text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <span className="badge bg-white/20 text-indigo-50 border border-white/20 backdrop-blur-md">Grade 6-11 English</span>
            </div>
            
            <div className="mb-10">
              <h3 className="font-display text-4xl font-bold mb-4 leading-tight">Master English at your own pace.</h3>
              <p className="text-indigo-200 text-lg">Interactive exercises, instant feedback, and detailed progress tracking to help you succeed.</p>
            </div>
            
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;