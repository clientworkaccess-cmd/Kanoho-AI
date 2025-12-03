import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-[10px] font-bold text-zinc-500 font-display tracking-widest uppercase ml-1">{label}</label>}
      <div className="relative group">
        <input
          className={`w-full bg-zinc-900/20 border border-white/10 text-zinc-100 px-4 py-3 rounded-lg placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900/40 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300 font-sans text-sm backdrop-blur-sm ${className}`}
          {...props}
        />
        {/* Glow effect on focus (via CSS or pseudo) - implied by border color change */}
      </div>
      {error && <p className="text-xs text-rose-400 ml-1">{error}</p>}
    </div>
  );
};