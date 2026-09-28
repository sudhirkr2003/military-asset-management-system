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
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'amber': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'cyan': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl transition-all duration-300 border border-slate-800/80 shadow-xl ${getGlow(glowColor)} ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${getBadgeStyle(badgeColor)}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{subtext}</span>
        {badgeText && (
          <span className={`px-2 py-0.5 font-mono text-[10px] font-semibold rounded-full border ${getBadgeStyle(badgeColor)}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
