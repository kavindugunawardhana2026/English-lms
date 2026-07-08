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

  const navLinks = isAuthenticated
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Exercises', path: '/exercises' },
        ...(user?.role === 'teacher' ? [{ label: 'Admin', path: '/admin' }] : []),
      ]
    : [
        { label: 'Features', path: '/#features', isAnchor: true },
        { label: 'How it works', path: '/#how-it-works', isAnchor: true },
      ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 pointer-events-none flex justify-center">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl pointer-events-auto"
      >
        <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group" onClick={() => setMenuOpen(false)}>
            <motion.div 
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
            >
              KE
            </motion.div>
            <span className="font-display font-bold text-gray-900 text-lg tracking-tight hidden sm:block group-hover:text-indigo-600 transition-colors">
              Kavindu's English
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-100/50">
            {navLinks.map((link) => {
              const isActive = !link.isAnchor && location.pathname.startsWith(link.path) && link.path !== '/';
              return link.isAnchor ? (
                <a
                  key={link.label}
                  href={link.path}
                  className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors rounded-lg z-10"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg z-10 ${
                    isActive ? 'text-indigo-700' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200/50 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side (Auth / Profile) */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 py-2 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gray-100/60 bg-gradient-to-br from-indigo-50/50 to-white">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                        {user?.grade && (
                          <span className="mt-3 inline-flex badge bg-indigo-100 text-indigo-700">
                            Grade {user.grade}
                          </span>
                        )}
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                          My Profile
                        </Link>
                        
                        {/* Mobile specific links */}
                        <div className="md:hidden space-y-1 pt-1 border-t border-gray-100/60 mt-1">
                          {navLinks.map((link) => (
                            link.isAnchor ? (
                              <a key={link.label} href={link.path} onClick={() => setMenuOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">{link.label}</a>
                            ) : (
                              <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">{link.label}</Link>
                            )
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-2 border-t border-gray-100/60">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-red-100 rounded-lg text-red-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          </div>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm rounded-xl shadow-glow">
                  Get Started
                </Link>
                
                {/* Mobile menu button for non-auth */}
                <button
                  className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
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
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown for non-auth */}
        <AnimatePresence>
          {menuOpen && !isAuthenticated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100/60 overflow-hidden bg-white/50"
            >
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors mt-2"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;