import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { WEBHOOK_GENERAL } from '../constants';
import { useToast } from '../hooks/useToast';

const TranscriptUpload: React.FC = () => {
  const { user } = useAuth();
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    setUploading(true);
    try {
      // Prepend Video URL if exists
      const finalContent = videoUrl ? `Reference Video: ${videoUrl}\n\n${content}` : content;
      const fileBlob = new Blob([finalContent], { type: 'text/plain' });
      const fileNameFull = filename.endsWith('.txt') ? filename : `${filename}.txt`;

      // 1. Insert Metadata
      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        name: fileNameFull,
        category: category || 'Transcript',
        size_mb: fileBlob.size / (1024 * 1024),
        mime_type: 'text/plain',
        status: 'processed',
        video_url: videoUrl || null,
      });

      if (dbError) throw dbError;

      // 2. Send to Webhook
      const formData = new FormData();
      // Use fileNameFull as the key so the webhook sees the actual filename
      formData.append(fileNameFull, fileBlob, fileNameFull);
      
      // Send file_name without extension
      const fileNameNoExt = fileNameFull.replace(/\.[^/.]+$/, "");
      formData.append('file_name', fileNameNoExt);
      
      formData.append('email', user.email);
      if (videoUrl) formData.append('video_url', videoUrl);

      const response = await fetch(WEBHOOK_GENERAL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Webhook failed');

      addToast('Transcript uploaded successfully.', 'success');
      setFilename('');
      setContent('');
      setVideoUrl('');
      setCategory('');
    } catch (error) {
      console.error(error);
      addToast('Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Filename" 
          required 
          value={filename} 
          onChange={(e) => setFilename(e.target.value)} 
          placeholder="meeting-notes-sep-12" 
        />
        <Input 
          label="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="e.g Policy, Manual" 
        />
      </div>
      
      <Input 
        label="Video URL (Optional)" 
        type="url"
        value={videoUrl} 
        onChange={(e) => setVideoUrl(e.target.value)} 
        placeholder="https://youtube.com/..." 
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-waveDark-100 dark:text-waveLight-100 tracking-widest uppercase">Content</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full bg-waveDark-500 dark:bg-waveLight-900 border border-waveDark-300 dark:border-waveLight-800 text-waveDark-100 dark:text-waveLight-100 px-3 py-2 focus:outline-none transition-colors font-mono text-xs rounded-lg"
          placeholder="Paste transcript content here..."
        />
      </div>

      <Button type="submit" isLoading={uploading} className="w-full">
        Upload Transcript
      </Button>
    </form>
  );
};

export default TranscriptUpload;