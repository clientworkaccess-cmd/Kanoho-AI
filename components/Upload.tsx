import React, { useState } from 'react';
import { Card } from './ui/Card';
import { UploadTab } from '../types';
import AudioUpload from './AudioUpload';
import TranscriptUpload from './TranscriptUpload';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { WEBHOOK_GENERAL } from '../constants';
import { useToast } from '../hooks/useToast';

const Upload: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UploadTab>('document');
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleGeneralUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !user.email) return;

    setUploading(true);
    try {
      // 1. Insert Metadata
      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        name: file.name,
        category: category || 'Document',
        size_mb: file.size / (1024 * 1024),
        mime_type: file.type,
        status: 'processing',
        video_url: videoUrl || null,
      });

      if (dbError) throw dbError;

      // 2. Send to Webhook
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', user.email);
      if (videoUrl) formData.append('video_url', videoUrl);

      const response = await fetch(WEBHOOK_GENERAL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Webhook failed');

      addToast('Document uploaded successfully.', 'success');
      setFile(null);
      setCategory('');
      setVideoUrl('');
    } catch (error) {
      console.error(error);
      addToast('Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Upload Center</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Ingest data into the knowledge base.</p>
      </div>

      <Card>
        <div className="flex border-b border-slate-100 dark:border-white/10 mb-6">
          {(['document', 'audio', 'transcript'] as UploadTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium font-display tracking-wide uppercase transition-colors relative ${
                activeTab === tab 
                  ? 'text-indigo-600 dark:text-white' 
                  : 'text-slate-500 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'document' && (
          <form onSubmit={handleGeneralUpload} className="space-y-6">
             <div className="border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 p-8 text-center transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:border-indigo-500 dark:hover:border-indigo-500/50 rounded-lg">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden" 
                id="doc-upload"
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                {file ? (
                     <span className="text-indigo-600 dark:text-indigo-400 font-medium font-mono text-sm">{file.name}</span>
                ) : (
                    <>
                        <span className="text-slate-700 dark:text-white font-medium mb-1">Select Document</span>
                        <span className="text-slate-500 dark:text-zinc-500 text-xs uppercase tracking-wide">PDF, DOCX, TXT</span>
                    </>
                )}
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="e.g. Policy, Manual" 
              />
              <Input 
                label="Related Video URL (Optional)" 
                type="url"
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
                placeholder="https://..." 
              />
            </div>

            <Button type="submit" disabled={!file} isLoading={uploading} className="w-full">
              Start Ingestion
            </Button>
          </form>
        )}

        {activeTab === 'audio' && <AudioUpload />}
        {activeTab === 'transcript' && <TranscriptUpload />}
      </Card>
    </div>
  );
};

export default Upload;