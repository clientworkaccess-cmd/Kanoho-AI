import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      addToast('Security credentials updated.', 'success');
      setPassword('');
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">System Configuration</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Manage agent access controls and interface preferences.</p>
      </div>

      <Card title="Interface Preferences">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-600'}`}>
              {theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Interface Theme</p>
              <p className="text-xs text-slate-500 dark:text-zinc-500">Toggle between light and dark operating modes.</p>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#050505] ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </Card>

      <Card title="Security Protocols">
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <Input 
            label="User Identity (UUID)" 
            value={user?.id || ''} 
            readOnly 
            className="opacity-50 font-mono text-xs cursor-not-allowed" 
          />
          
          <Input 
            label="New Access Key (Password)" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={!password} isLoading={loading}>
              Update Credentials
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;