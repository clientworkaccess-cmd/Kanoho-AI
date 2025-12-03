import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { WEBHOOK_AUDIO } from '../constants';
import { useToast } from '../hooks/useToast';

const AudioUpload: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !user.email) return;

    setUploading(true);
    try {
      // 1. Insert Metadata
      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        name: file.name,
        category: category || 'Audio',
        size_mb: file.size / (1024 * 1024),
        mime_type: file.type,
        status: 'processing',
      });

      if (dbError) throw dbError;

      // 2. Send to Webhook
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', user.email);
      formData.append('category', category || 'Audio');

      const response = await fetch(WEBHOOK_AUDIO, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Webhook failed');

      addToast('Audio uploaded and queued for transcription.', 'success');
      setFile(null);
      setCategory('');
    } catch (error) {
      console.error(error);
      addToast('Upload failed. Check connection.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6 mt-6">
       <div className="border border-dashed border-white/20 bg-white/5 p-8 text-center transition-colors hover:bg-white/10 hover:border-indigo-500/50">
        <input 
          type="file" 
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden" 
          id="audio-upload"
        />
        <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
            {file ? (
                 <span className="text-indigo-400 font-medium font-mono text-sm">{file.name}</span>
            ) : (
                <>
                    <span className="text-white font-medium mb-1">Select Audio File</span>
                    <span className="text-zinc-500 text-xs uppercase tracking-wide">MP3, WAV, M4A supported</span>
                </>
            )}
        </label>
      </div>

      <Input 
        label="Category (Optional)" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        placeholder="e.g. Meeting, Interview" 
      />

      <Button type="submit" disabled={!file} isLoading={uploading} className="w-full">
        Upload Audio
      </Button>
    </form>
  );
};

export default AudioUpload;