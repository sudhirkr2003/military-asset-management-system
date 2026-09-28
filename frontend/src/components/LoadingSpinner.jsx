import React from 'react';

const LoadingSpinner = ({ label = 'Loading military logistics data...' }) => (
  <div className="flex flex-col items-center justify-center p-12">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
    <p className="mt-4 text-sm font-medium text-slate-400 tracking-wider uppercase">{label}</p>
  </div>
);

export default LoadingSpinner;
