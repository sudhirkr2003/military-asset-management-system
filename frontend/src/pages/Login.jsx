import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Lock, User, ArrowRight, AlertCircle, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div 
      style={{ backgroundColor: '#f8fafc' }}
      className="min-h-screen bg-tactical-grid flex items-center justify-center p-4 relative overflow-hidden"
    >

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 mb-4 shadow-xl shadow-indigo-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 
            style={{ color: isDark ? '#ffffff' : '#0f172a' }}
            className="text-2xl font-extrabold uppercase tracking-wider"
          >
            Military Asset Management
          </h1>
          <p 
            style={{ color: isDark ? '#94a3b8' : '#475569' }}
            className="text-xs font-semibold mt-1"
          >
            Logistics Command & Inventory Control System
          </p>
        </div>

        {/* Login Form Card */}
        <div 
          style={{ 
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: isDark ? '#1e293b' : '#cbd5e1'
          }}
          className="p-8 rounded-3xl border shadow-2xl transition-colors"
        >
          <h2 
            style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
            className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-indigo-500" />
            Sign In to Account
          </h2>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label 
                style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                className="block text-xs font-bold uppercase mb-1.5 font-mono"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold transition-colors"
                />
              </div>
            </div>

            <div>
              <label 
                style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                className="block text-xs font-bold uppercase mb-1.5 font-mono"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
