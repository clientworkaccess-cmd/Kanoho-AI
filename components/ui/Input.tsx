import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-[10px] font-bold text-waveDark-100 dark:text-waveLight-100 font-display tracking-widest uppercase ml-1">{label}</label>}
      <div className="relative group">
        <input
          className={`w-full bg-waveDark-500 dark:bg-waveLight-900 border border-waveDark-300 dark:border-waveLight-800 text-waveDark-100 dark:text-waveLight-100 px-4 py-3 rounded-lg focus:outline-none transition-all duration-300 font-sans text-sm backdrop-blur-sm ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 ml-1">{error}</p>}
    </div>
  );
};