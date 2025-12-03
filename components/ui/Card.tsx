import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`premium-glass-card rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group ${className}`}>
      {/* Subtle top sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
      
      <div className="p-6 md:p-8 relative z-10">
        {(title || action) && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            {title && <h3 className="text-lg font-display font-semibold text-white tracking-tight">{title}</h3>}
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};