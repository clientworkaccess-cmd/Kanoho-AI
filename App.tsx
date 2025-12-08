import React, { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { session, loading } = useAuth();

  // Initialize theme on mount to prevent flash
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(savedTheme);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-violet-500 rounded-full animate-spin reverse"></div>
          </div>
          <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs tracking-[0.2em] animate-pulse">Kanoho AI</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white relative transition-colors duration-500">
      {/* Premium Background Architecture */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-30 pointer-events-none z-0 mix-blend-overlay"></div>
      
      {/* Ambient Orbs - Adjusted for Light Mode */}
      <div className="fixed top-[-30%] left-[-10%] w-[70%] h-[70%] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="fixed bottom-[-30%] right-[-10%] w-[60%] h-[60%] bg-violet-300/20 dark:bg-violet-900/10 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow delay-1000"></div>
      <div className="fixed top-[20%] left-[30%] w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-900/5 rounded-full blur-[180px] pointer-events-none z-0"></div>

      <div className="relative z-10 h-full">
        {!session ? <Auth /> : <Dashboard />}
      </div>
    </div>
  );
};

export default App;