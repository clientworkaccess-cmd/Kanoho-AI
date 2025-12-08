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
    { id: 'kb', label: 'Knowledge', icon: FolderIcon },
    { id: 'upload', label: 'Upload', icon: CloudArrowUpIcon },
    { id: 'company', label: 'Profile', icon: BuildingOfficeIcon },
    // { id: 'integrations', label: 'Connect', icon: CommandLineIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-wave-gradient dark:bg-ocean-gradient overflow-hidden relative transition-colors duration-500">
       {/* Sleek Sidebar */}
       <aside className="w-20 lg:w-72 bg-wave-gradient dark:bg-ocean-gradient backdrop-blur-xl border-r border-waveDark-300 dark:border-waveLight-800 flex flex-col justify-between shrink-0 z-30 transition-all duration-500">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-waveDark-300 dark:border-waveLight-800 bg-wave-gradient dark:bg-foam-gradient">
             <div className="w-10 h-10 rounded-lg ">
               <img src="https://res.cloudinary.com/djmakoiji/image/upload/v1764949083/image-3-removebg-preview_wkvbbz.png" alt="Kanoho Logo" />
             </div>
             <div className="hidden lg:block ml-4">
                <span className="block font-display font-bold tracking-tight text-primaryDark dark:text-primary text-lg">KANOHO</span>
                <span className="block text-[10px] text-waveDark-50 dark:text-waveLight-100 tracking-[0.2em] font-mono uppercase">Artificial Intelligence</span>
             </div>
          </div>

          <nav className="mt-10 flex flex-col gap-2 px-3 lg:px-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  activeNav === item.id 
                    ? 'text-waveLight-700 dark:text-waveLight-200 bg-waveDark-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg' 
                    : 'text-waveDark-700 dark:text-waveLight-600 hover:text-slate-900 dark:hover:text-waveLight-200 hover:bg-waveDark-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {activeNav === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-waveLight-700 dark:bg-waveLight-600 shadow-[0_0_10px_#6366f1]"></div>
                )}
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${activeNav === item.id ? 'text-waveLight-700 dark:text-waveLite-200' : 'group-hover:text-slate-900 dark:group-hover:text-waveLight-200'}`} />
                <span className="hidden lg:block text-sm font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-waveDark-300 dark:border-waveLight-800 bg-wave-gradient dark:bg-ocean-gradient">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-form-gradient flex items-center justify-center text-sm font-bold text-primaryDark dark:text-primary shrink-0 shadow-lg ring-1 ring-white/20">
               {profile?.full_name?.charAt(0) || profile?.email?.charAt(0)}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-primaryDark dark:text-primary truncate font-display capitalize">{profile?.full_name || 'Agent'}</p>
              <p className="text-[10px] text-waveLight-200 dark:text-waveDark-400 truncate font-mono tracking-wider">{profile?.email}</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center gap-3 text-waveLight-800 dark:text-waveDark-500 hover:text-waveLight-900 dark:hover:text-waveDark-400 transition-colors w-full justify-center lg:justify-start text-xs font-medium uppercase tracking-widest px-2"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden lg:block">Signout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 bg-wave-gradient dark:bg-foam-gradient backdrop-blur-xl border-b border-waveDark-300 dark:border-waveLight-800 flex items-center justify-between px-8 z-20 transition-all duration-500">
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