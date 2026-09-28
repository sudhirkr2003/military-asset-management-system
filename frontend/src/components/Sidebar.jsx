import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ArrowRightLeft, 
  Layers,
  FileCode,
  ShieldCheck,
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose }) => {
  const { isDark } = useTheme();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Purchases Page', path: '/purchases', icon: ShoppingBag },
    { label: 'Transfer Page', path: '/transfers', icon: ArrowRightLeft },
    { label: 'Assignments & Expenditures Page', path: '/assignments-expenditures', icon: Layers },
    { label: 'API Documentation', path: '/docs', icon: FileCode },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const NavContent = () => (
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
                onClick={handleNavClick}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#4f46e5' : 'transparent',
                  color: isActive ? '#ffffff' : (isDark ? '#cbd5e1' : '#0f172a'),
                  borderColor: isActive ? '#4338ca' : 'transparent'
                })}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    !isActive ? (isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-indigo-600') : ''
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );

  const SecurityCard = () => (
    <div 
      style={{ 
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        borderColor: isDark ? '#1e293b' : '#e2e8f0'
      }}
      className="p-3.5 rounded-xl border text-xs shadow-sm mt-auto"
    >
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold mb-1">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Role-Based Security</span>
      </div>
      <p 
        style={{ color: isDark ? '#94a3b8' : '#475569' }}
        className="text-[11px] font-semibold leading-relaxed"
      >
        RBAC security & transaction audit logging active across all modules.
      </p>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Hidden on screens below lg) */}
      <aside 
        style={{ 
          backgroundColor: isDark ? '#090d16' : '#ffffff', 
          borderColor: isDark ? '#1e293b' : '#e2e8f0' 
        }}
        className="hidden lg:flex w-64 border-r p-4 flex-col justify-between min-h-[calc(100vh-61px)] shrink-0 transition-colors"
      >
        <NavContent />
        <SecurityCard />
      </aside>

      {/* Mobile & Tablet Drawer Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile & Tablet Sliding Drawer */}
      <aside 
        style={{ 
          backgroundColor: isDark ? '#090d16' : '#ffffff', 
          borderColor: isDark ? '#1e293b' : '#e2e8f0' 
        }}
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] border-r p-4 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Command Menu
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <NavContent />
        </div>

        <SecurityCard />
      </aside>
    </>
  );
};

export default Sidebar;
