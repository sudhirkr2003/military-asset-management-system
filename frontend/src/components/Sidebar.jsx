import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ArrowRightLeft, 
  Layers,
  FileCode,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { isDark } = useTheme();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Purchases Page', path: '/purchases', icon: ShoppingBag },
    { label: 'Transfer Page', path: '/transfers', icon: ArrowRightLeft },
    { label: 'Assignments & Expenditures Page', path: '/assignments-expenditures', icon: Layers },
    { label: 'API Documentation', path: '/docs', icon: FileCode },
  ];

  return (
    <aside 
      style={{ 
        backgroundColor: isDark ? '#090d16' : '#ffffff', 
        borderColor: isDark ? '#1e293b' : '#e2e8f0' 
      }}
      className="w-64 border-r p-4 flex flex-col justify-between min-h-[calc(100vh-61px)] transition-colors"
    >
      <div className="space-y-6">
        <div>
          <div 
            style={{ color: isDark ? '#94a3b8' : '#334155' }}
            className="px-3 mb-2 text-[11px] font-mono font-extrabold uppercase tracking-wider"
          >
            System Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    backgroundColor: isActive 
                      ? '#4f46e5' 
                      : (isDark ? 'transparent' : 'transparent'),
                    color: isActive 
                      ? '#ffffff' 
                      : (isDark ? '#cbd5e1' : '#0f172a'),
                    borderColor: isActive ? '#4338ca' : 'transparent'
                  })}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      !isActive ? (isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-indigo-600') : ''
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Security Status Card */}
      <div 
        style={{ 
          backgroundColor: isDark ? '#0f172a' : '#f8fafc',
          borderColor: isDark ? '#1e293b' : '#e2e8f0'
        }}
        className="p-3.5 rounded-xl border text-xs shadow-sm"
      >
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Role-Based Security</span>
        </div>
        <p 
          style={{ color: isDark ? '#94a3b8' : '#475569' }}
          className="text-[11px] font-semibold leading-relaxed"
        >
          RBAC security & transaction audit logging active across all modules.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
