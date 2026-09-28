import React from 'react';

const MetricCard = ({ title, value, subtext, icon: Icon, badgeText, badgeColor = 'emerald', onClick, glowColor = 'indigo' }) => {
  const getGlow = (color) => {
    switch (color) {
      case 'emerald': return 'hover:border-emerald-500/40 hover:shadow-emerald-500/10';
      case 'amber': return 'hover:border-amber-500/40 hover:shadow-amber-500/10';
      case 'rose': return 'hover:border-rose-500/40 hover:shadow-rose-500/10';
      case 'cyan': return 'hover:border-cyan-500/40 hover:shadow-cyan-500/10';
      default: return 'hover:border-indigo-500/40 hover:shadow-indigo-500/10';
    }
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rose': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'cyan': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`glass-panel p-4 sm:p-5 rounded-2xl transition-all duration-300 border border-slate-200 shadow-sm ${getGlow(glowColor)} ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate block">
            {title}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-0.5 sm:mt-1 truncate">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2 sm:p-2.5 rounded-xl border shrink-0 ${getBadgeStyle(badgeColor)}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500">
        <span className="truncate">{subtext}</span>
        {badgeText && (
          <span className={`px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold rounded-full border shrink-0 ${getBadgeStyle(badgeColor)}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
