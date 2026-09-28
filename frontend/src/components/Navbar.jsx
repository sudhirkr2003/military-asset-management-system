import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, LogOut, Building2, FileCode, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  return (
    <header 
      style={{ 
        backgroundColor: isDark ? '#090d16' : '#ffffff', 
        borderColor: isDark ? '#1e293b' : '#e2e8f0' 
      }}
      className="sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-6 py-2.5 sm:py-3 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left Branding & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Tactical Badge Logo */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
          </div>

          {/* Titles */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 
                style={{ color: isDark ? '#ffffff' : '#0f172a' }}
                className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider uppercase truncate"
              >
                Military Asset Management
              </h1>
              <span 
                style={{ 
                  backgroundColor: isDark ? '#1e293b' : '#e0e7ff',
                  color: isDark ? '#cbd5e1' : '#3730a3',
                  borderColor: isDark ? '#334155' : '#c7d2fe'
                }}
                className="hidden xs:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold rounded border shrink-0"
              >
                v1.0.0
              </span>
            </div>
            <p 
              style={{ color: isDark ? '#94a3b8' : '#475569' }}
              className="text-[10px] sm:text-xs font-semibold hidden md:block truncate"
            >
              Logistics Command &amp; Inventory Control System
            </p>
          </div>
        </div>

        {/* Right Action & User Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
              className="flex items-center gap-2 sm:gap-3 border rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div 
                  style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  className="text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="truncate max-w-[120px]">{user.fullName || user.username}</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-extrabold rounded-full border bg-amber-500/10 text-amber-600 border-amber-500/30">
                    {user.role}
                  </span>
                </div>
                <div 
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                  className="text-[10px] font-semibold flex items-center gap-1 truncate max-w-[140px]"
                >
                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{user.baseName || 'HQ / All Bases'}</span>
                </div>
              </div>

              <button
                onClick={logout}
                style={{ color: isDark ? '#94a3b8' : '#475569' }}
                className="p-1 sm:p-1.5 hover:text-rose-600 rounded-lg transition-colors ml-0.5"
                title="Sign Out"
                aria-label="Sign Out"
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
