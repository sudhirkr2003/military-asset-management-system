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
      className="sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-5 py-2 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left Branding & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Tactical Badge Logo */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>

          {/* App Title */}
          <h1 
            style={{ color: isDark ? '#ffffff' : '#0f172a' }}
            className="text-xs sm:text-sm font-bold tracking-wide uppercase truncate"
          >
            Military Asset Management
          </h1>
        </div>

        {/* Right Action & User Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <NavLink
            to="/docs"
            style={{ 
              backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
              borderColor: isDark ? '#1e293b' : '#cbd5e1',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-500" />
            <span>API Docs</span>
          </NavLink>

          {user && (
            <div 
              style={{ 
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                borderColor: isDark ? '#1e293b' : '#e2e8f0' 
              }}
              className="flex items-center gap-2 border rounded-lg px-2 py-1 shadow-sm"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div 
                  style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  <span className="truncate max-w-[120px]">{user.fullName || user.username}</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                style={{ color: isDark ? '#94a3b8' : '#475569' }}
                className="p-1 hover:text-rose-600 rounded-md transition-colors ml-0.5"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
