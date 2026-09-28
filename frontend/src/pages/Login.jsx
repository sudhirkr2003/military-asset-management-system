import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Lock, User, ArrowRight, AlertCircle, Key, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
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

  const handleDemoSelect = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div 
      style={{ backgroundColor: isDark ? '#0b0f19' : '#ffffff' }}
      className="min-h-screen bg-tactical-grid flex items-center justify-center p-4 relative overflow-hidden transition-colors"
    >
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          style={{ 
            backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
            borderColor: isDark ? '#1e293b' : '#cbd5e1',
            color: isDark ? '#fbbf24' : '#4f46e5'
          }}
          className="p-2.5 rounded-xl border transition-colors shadow-sm"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

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

          {/* Quick Demo Accounts Selection Cards */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div 
              style={{ color: isDark ? '#94a3b8' : '#475569' }}
              className="text-[11px] font-mono uppercase font-bold text-center mb-3 flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              Demo Role Accounts (Click to Fill)
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('admin', 'Admin@123')}
                style={{ 
                  backgroundColor: username === 'admin' ? (isDark ? '#78350f' : '#fef3c7') : (isDark ? '#090d16' : '#f8fafc'),
                  borderColor: username === 'admin' ? '#f59e0b' : (isDark ? '#1e293b' : '#e2e8f0'),
                  color: isDark ? '#f8fafc' : '#0f172a'
                }}
                className="p-2.5 rounded-xl text-left border transition-all hover:border-amber-500 shadow-sm"
              >
                <div className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">Admin</div>
                <div className="text-[9px] font-mono font-semibold opacity-80 mt-0.5">Full Access</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('commander_alpha', 'Commander@123')}
                style={{ 
                  backgroundColor: username === 'commander_alpha' ? (isDark ? '#312e81' : '#e0e7ff') : (isDark ? '#090d16' : '#f8fafc'),
                  borderColor: username === 'commander_alpha' ? '#6366f1' : (isDark ? '#1e293b' : '#e2e8f0'),
                  color: isDark ? '#f8fafc' : '#0f172a'
                }}
                className="p-2.5 rounded-xl text-left border transition-all hover:border-indigo-500 shadow-sm"
              >
                <div className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">Commander</div>
                <div className="text-[9px] font-mono font-semibold opacity-80 mt-0.5">Base Alpha</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('logistics', 'Logistics@123')}
                style={{ 
                  backgroundColor: username === 'logistics' ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#090d16' : '#f8fafc'),
                  borderColor: username === 'logistics' ? '#10b981' : (isDark ? '#1e293b' : '#e2e8f0'),
                  color: isDark ? '#f8fafc' : '#0f172a'
                }}
                className="p-2.5 rounded-xl text-left border transition-all hover:border-emerald-500 shadow-sm"
              >
                <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">Logistics</div>
                <div className="text-[9px] font-mono font-semibold opacity-80 mt-0.5">Transfers</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
