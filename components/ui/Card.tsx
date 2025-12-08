import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`backdrop-blur-xl rounded-xl border border-waveDark-300 dark:border-waveLight-800 shadow-lg dark:shadow-2xl relative overflow-hidden group transition-all duration-500 ${className}`}>
      {/* Subtle top sheen - Dark Mode Only */}
      <div className="hidden dark:block absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
      
      <div className="p-6 md:p-8 relative z-10">
        {(title || action) && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-waveDark-300 dark:border-waveLight-800">
            {title && <h3 className="text-lg font-display font-semibold text-waveDark-600 dark:text-waveLight-500 tracking-tight">{title}</h3>}
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};