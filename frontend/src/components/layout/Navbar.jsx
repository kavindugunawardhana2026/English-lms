import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // If we are on an auth page, we might want a simpler navbar or to hide it, 
  // but let's keep it consistent and just make it absolute transparent if we want.
  // For now, let's use the premium dark/glass look globally so it looks like a real SaaS.

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="container-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-glow">
              KE
            </div>
            <span className="font-display font-bold text-gray-900 text-lg tracking-tight hidden sm:block">
              Kavindu's English
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`btn-ghost ${location.pathname === '/dashboard' ? 'text-indigo-600 bg-indigo-50' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/exercises" className={`btn-ghost ${location.pathname.startsWith('/exercises') ? 'text-indigo-600 bg-indigo-50' : ''}`}>
                  Exercises
                </Link>
                {user?.role === 'teacher' && (
                  <Link to="/admin" className="btn-ghost text-violet-600 hover:bg-violet-50">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/#features" className="btn-ghost">Features</Link>
                <Link to="/#how-it-works" className="btn-ghost">How it works</Link>
              </>
            )}
          </div>

          {/* Right side (Auth / Profile) */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[100px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {user?.grade && (
                          <span className="mt-2 inline-flex badge bg-indigo-100 text-indigo-700">
                            Grade {user.grade}
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          My Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors md:hidden"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                          Dashboard
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost hidden sm:flex">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm shadow-md">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen 
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown for non-auth / extra links */}
      <AnimatePresence>
        {menuOpen && !isAuthenticated && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              <Link to="/#features" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">Features</Link>
              <Link to="/#how-it-works" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">How it works</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">Sign In</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;