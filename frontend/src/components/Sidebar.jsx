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
    { label: 'Purchases', path: '/purchases', icon: ShoppingBag },
    { label: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
    { label: 'Assignments & Expenditures', path: '/assignments-expenditures', icon: Layers },
    { label: 'API Documentation', path: '/docs', icon: FileCode },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const NavContent = () => (
    <div className="space-y-4">
      <div>
        <div className="px-3 mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        <nav className="space-y-0.5">
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
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
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
    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs shadow-sm mt-auto">
      <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-0.5 text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Role-Based Access</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-normal">
        Security controls and transaction logs active.
      </p>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside 
        style={{ 
          backgroundColor: isDark ? '#090d16' : '#ffffff', 
          borderColor: isDark ? '#1e293b' : '#e2e8f0' 
        }}
        className="hidden lg:flex w-60 border-r p-3.5 flex-col justify-between min-h-[calc(100vh-57px)] shrink-0 transition-colors"
      >
        <NavContent />
        <SecurityCard />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sliding Drawer */}
      <aside 
        style={{ 
          backgroundColor: isDark ? '#090d16' : '#ffffff', 
          borderColor: isDark ? '#1e293b' : '#e2e8f0' 
        }}
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 max-w-[80vw] border-r p-3.5 flex flex-col justify-between shadow-xl transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Menu
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
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
