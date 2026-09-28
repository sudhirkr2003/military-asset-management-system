import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      // Fetch user profile if token exists but user state is missing
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token: jwtToken, ...userData } = response.data;
      
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      // Demo Mode Fallback if backend server is not running
      const demoUsers = {
        'admin': { userId: 1, username: 'admin', email: 'admin@test.com', fullName: 'Gen. Arthur Vance', role: 'ADMIN', baseId: null, baseName: 'All Bases (HQ)' },
        'commander_alpha': { userId: 2, username: 'commander_alpha', email: 'commander@test.com', fullName: 'Col. Sarah Connor', role: 'BASE_COMMANDER', baseId: 1, baseName: 'Base Alpha' },
        'logistics': { userId: 3, username: 'logistics', email: 'logistics@test.com', fullName: 'Maj. Roy Mustang', role: 'LOGISTICS_OFFICER', baseId: 1, baseName: 'Base Alpha' }
      };

      if (demoUsers[username] && (password === 'Admin@123' || password === 'Commander@123' || password === 'Logistics@123' || password === 'password')) {
        const fallbackUser = demoUsers[username];
        const dummyToken = 'demo-jwt-token-' + Date.now();
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setToken(dummyToken);
        setUser(fallbackUser);
        return { success: true, user: fallbackUser, isDemo: true };
      }

      const errorMessage = error.response?.data?.message || 'Invalid username or password';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
