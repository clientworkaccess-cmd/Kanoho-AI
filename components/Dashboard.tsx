import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FileList from './FileList';
import Upload from './Upload';
import CompanyDetails from './CompanyDetails';
//import Integration from './Integration';
import Settings from './Settings';
import { 
  FolderIcon, 
  CloudArrowUpIcon, 
  BuildingOfficeIcon, 
  CommandLineIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState('kb');

  // Check for OAuth redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code')) {
      setActiveNav('integrations');
    }
  }, []);

  const renderContent = () => {
    switch (activeNav) {
      case 'kb': return <FileList />;
      case 'upload': return <Upload />;
      case 'company': return <CompanyDetails />;
     // case 'integrations': return <Integration />;
      case 'settings': return <Settings />;
      default: return <FileList />;
    }
  };

  const navItems = [
    { id: 'kb', label: 'Index', icon: FolderIcon },
    { id: 'upload', label: 'Upload', icon: CloudArrowUpIcon },
    { id: 'company', label: 'Entity', icon: BuildingOfficeIcon },
    //{ id: 'integrations', label: 'Connect', icon: CommandLineIcon },
    { id: 'settings', label: 'System', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#050505] overflow-hidden relative transition-colors duration-500">
       {/* Sleek Sidebar */}
       <aside className="w-20 lg:w-72 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex flex-col justify-between shrink-0 z-30 transition-all duration-500">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-200 dark:border-white/5 bg-slate-50/[0.5] dark:bg-white/[0.01]">
             <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
               <Squares2X2Icon className="w-5 h-5 text-white" />
             </div>
             <div className="hidden lg:block ml-4">
                <span className="block font-display font-bold tracking-tight text-slate-900 dark:text-white text-lg">KANOHO</span>
                <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 tracking-[0.2em] font-mono uppercase">Artificial Intelligence</span>
             </div>
          </div>

          <nav className="mt-10 flex flex-col gap-2 px-3 lg:px-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  activeNav === item.id 
                    ? 'text-indigo-600 dark:text-white bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg' 
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {activeNav === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                )}
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${activeNav === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'group-hover:text-slate-900 dark:group-hover:text-white'}`} />
                <span className="hidden lg:block text-sm font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/[0.5] dark:bg-white/[0.01]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg ring-1 ring-white/20">
               {profile?.full_name?.charAt(0) || profile?.email?.charAt(0)}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-display">{profile?.full_name || 'Agent'}</p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 truncate font-mono uppercase tracking-wider">{profile?.email}</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center gap-3 text-rose-600/80 dark:text-rose-500/80 hover:text-rose-700 dark:hover:text-rose-400 transition-colors w-full justify-center lg:justify-start text-xs font-medium uppercase tracking-widest px-2"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden lg:block">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 z-20 transition-all duration-500">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">System Operational</span>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono tracking-widest">
              ENCRYPTED CONNECTION // TLS 1.3
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 relative scroll-smooth">
          <div className="max-w-[1400px] mx-auto w-full pb-20">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;