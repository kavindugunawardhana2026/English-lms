import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const login = useCallback(async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    if (res.data.success) {
      saveSession(res.data.data.user, res.data.data.token);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  }, []);

  const register = useCallback(async ({ name, email, password, grade }) => {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name,
      email,
      password,
      role: 'student',
      grade: Number(grade),
    });
    if (res.data.success) {
      return { success: true };
    }
    return { success: false, message: res.data.message };
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`);
    } catch {
      // ignore
    } finally {
      clearSession();
    }
  }, []);

  const value = { user, token, loading, login, logout, register, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
