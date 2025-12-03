import React, { useEffect } from 'react';
import { useToast } from '../hooks/useToast';

const Refresh: React.FC = () => {
  const { addToast } = useToast();

  useEffect(() => {
    // Simulate a process
    const timer = setTimeout(() => {
      addToast('Vector Index Re-sync initiated.', 'info');
      
      setTimeout(() => {
        addToast('Index sync complete. All systems nominal.', 'success');
      }, 2500);
    }, 500);

    return () => clearTimeout(timer);
  }, [addToast]);

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h3 className="mt-8 text-xl font-display font-bold text-white tracking-wide">SYNCHRONIZING</h3>
      <p className="mt-2 text-zinc-500 text-sm font-mono uppercase tracking-widest">Rebuilding Vector Space...</p>
    </div>
  );
};

export default Refresh;