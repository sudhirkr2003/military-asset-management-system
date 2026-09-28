import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, LogOut, Building2, FileCode, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header 
      style={{ 
        backgroundColor: isDark ? '#090d16' : '#ffffff', 
        borderColor: isDark ? '#1e293b' : '#e2e8f0' 
      }}
      className="sticky top-0 z-40 backdrop-blur-md border-b px-6 py-3 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                style={{ color: isDark ? '#ffffff' : '#0f172a' }}
                className="text-base font-extrabold tracking-wider uppercase"
              >
                Military Asset Management
              </h1>
              <span 
                style={{ 
                  backgroundColor: isDark ? '#1e293b' : '#e0e7ff',
                  color: isDark ? '#cbd5e1' : '#3730a3',
                  borderColor: isDark ? '#334155' : '#c7d2fe'
                }}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border"
              >
                v1.0.0
              </span>
            </div>
            <p 
              style={{ color: isDark ? '#94a3b8' : '#475569' }}
              className="text-xs font-semibold"
            >
              Logistics Command & Inventory Control System
            </p>
          </div>
        </div>

        {/* Right Action & User Bar */}
        <div className="flex items-center gap-3">

          <NavLink
            to="/docs"
            style={{ 
              backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
              borderColor: isDark ? '#1e293b' : '#cbd5e1',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-500" />
            <span>API Docs</span>
          </NavLink>

          {user && (
            <div 
              style={{ 
                backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                borderColor: isDark ? '#1e293b' : '#cbd5e1'
              }}
              className="flex items-center gap-3 border rounded-xl px-3 py-1.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div 
                  style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  className="text-xs font-bold flex items-center gap-1.5"
                >
                  {user.fullName || user.username}
                  <span className="px-2 py-0.2 text-[10px] font-mono font-extrabold rounded-full border bg-amber-500/10 text-amber-600 border-amber-500/30">
                    {user.role}
                  </span>
                </div>
                <div 
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                  className="text-[11px] font-semibold flex items-center gap-1"
                >
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>{user.baseName || 'HQ / All Bases'}</span>
                </div>
              </div>

              <button
                onClick={logout}
                style={{ color: isDark ? '#94a3b8' : '#475569' }}
                className="p-1.5 hover:text-rose-600 rounded-lg transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
