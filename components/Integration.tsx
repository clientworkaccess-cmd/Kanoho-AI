import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { 
  GITHUB_CLIENT_ID, 
  GITHUB_CLIENT_SECRET, 
  SLACK_CLIENT_ID, 
  SLACK_CLIENT_SECRET, 
  WEBHOOK_GITHUB, 
  WEBHOOK_SLACK 
} from '../constants';
import { useToast } from '../hooks/useToast';

const Integration: React.FC = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const [processing, setProcessing] = useState(false);

  const redirectUrl = window.location.origin;

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code && state && user && profile && !processing) {
        setProcessing(true);
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        
        try {
          if (state === 'github') {
            await fetch(WEBHOOK_GITHUB, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code,
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                email: user.email,
                name: profile.full_name
              })
            });
            await supabase.from('profiles').update({ github_connected: true }).eq('id', user.id);
            addToast('GitHub connection established.', 'success');
          } else if (state === 'slack') {
            await fetch(WEBHOOK_SLACK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code,
                client_id: SLACK_CLIENT_ID,
                client_secret: SLACK_CLIENT_SECRET,
                email: user.email,
                name: profile.full_name
              })
            });
            await supabase.from('profiles').update({ slack_connected: true }).eq('id', user.id);
            addToast('Slack workspace connected.', 'success');
          }
          await refreshProfile();
        } catch (error) {
          console.error(error);
          addToast('Integration handshake failed.', 'error');
        } finally {
          setProcessing(false);
        }
      }
    };

    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const connectGitHub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUrl}&state=github&scope=repo`;
  };

  const connectSlack = () => {
    window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=channels:read,chat:write&redirect_uri=${redirectUrl}&state=slack`;
  };

  const disconnect = async (service: 'github' | 'slack') => {
    if (!user) return;
    try {
      if (service === 'github') {
        await supabase.from('profiles').update({ github_connected: false }).eq('id', user.id);
      } else {
        await supabase.from('profiles').update({ slack_connected: false }).eq('id', user.id);
      }
      await refreshProfile();
      addToast(`${service} disconnected.`, 'info');
    } catch (error) {
      addToast('Disconnect failed.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">External Nodes</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Connect third-party data pipelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Card */}
        <Card className="flex flex-col justify-between h-64 border-t-4 border-t-slate-900 dark:border-t-white">
          <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">GitHub</h3>
               <div className={`w-2 h-2 rounded-full ${profile?.github_connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-300 dark:bg-zinc-700'}`}></div>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Sync repositories, commit history, and documentation directly into the knowledge base.
            </p>
          </div>
          <div className="mt-6">
            {profile?.github_connected ? (
              <Button variant="danger" onClick={() => disconnect('github')} className="w-full">
                Terminate Connection
              </Button>
            ) : (
              <Button onClick={connectGitHub} className="w-full">
                Initialize Connection
              </Button>
            )}
          </div>
        </Card>

        {/* Slack Card */}
        <Card className="flex flex-col justify-between h-64 border-t-4 border-t-indigo-500">
           <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Slack</h3>
               <div className={`w-2 h-2 rounded-full ${profile?.slack_connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-300 dark:bg-zinc-700'}`}></div>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Ingest channel conversations and real-time messaging for context awareness.
            </p>
          </div>
          <div className="mt-6">
            {profile?.slack_connected ? (
              <Button variant="danger" onClick={() => disconnect('slack')} className="w-full">
                Terminate Connection
              </Button>
            ) : (
              <Button onClick={connectSlack} className="w-full">
                Initialize Connection
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Integration;