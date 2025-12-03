import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">System Configuration</h2>
        <p className="text-zinc-500 text-sm">Manage agent access controls.</p>
      </div>

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