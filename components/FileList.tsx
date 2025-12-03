import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { FileRecord } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { TrashIcon, DocumentIcon, VideoCameraIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';

const FileList: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchFiles = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFiles(data as FileRecord[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();

    const channel = supabase
      .channel('files-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'files' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFiles((prev) => [payload.new as FileRecord, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setFiles((prev) => prev.filter((f) => f.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setFiles((prev) => prev.map((f) => f.id === payload.new.id ? payload.new as FileRecord : f));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('files').delete().eq('id', deleteId);
      if (error) throw error;
      addToast('File purged from database.', 'success');
      setDeleteId(null);
    } catch (error) {
      addToast('Failed to delete file.', 'error');
    }
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f.category && f.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed': 
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold uppercase tracking-wider">Active</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20 font-bold uppercase tracking-wider">Error</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/20 font-bold uppercase tracking-wider animate-pulse">Processing</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Data Index</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage vector embeddings and knowledge assets.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <CubeIcon className="w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search Database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl text-sm pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900/80 transition-all font-sans"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
            <div className="text-center py-20">
                <div className="w-8 h-8 border-t-2 border-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Retrieving Assets...</span>
            </div>
        ) : filteredFiles.length === 0 ? (
            <div className="premium-glass-card rounded-xl p-12 text-center border-dashed border-zinc-800">
                <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">No Data Found</span>
            </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
             {/* Header Row */}
             <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <div className="col-span-5">Filename</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
             </div>
             
             {/* Data Rows */}
             {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:px-6 md:py-5 bg-zinc-900/20 hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-300"
                >
                    <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors border border-white/5">
                            <DocumentIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors font-display tracking-wide">{file.name}</div>
                            {file.video_url && (
                                <a href={file.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 mt-1 uppercase tracking-wide font-bold">
                                    <VideoCameraIcon className="w-3 h-3" /> Linked Media
                                </a>
                            )}
                             <div className="md:hidden text-xs text-zinc-500 mt-1">{file.category || 'Uncategorized'}</div>
                        </div>
                    </div>

                    <div className="hidden md:block col-span-3">
                        <span className="px-3 py-1 rounded-md bg-zinc-800/50 border border-white/5 text-xs text-zinc-400 font-medium">
                            {file.category || 'Uncategorized'}
                        </span>
                    </div>

                    <div className="col-span-6 md:col-span-2 flex items-center">
                        {getStatusBadge(file.status)}
                    </div>

                    <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-4">
                         <span className="text-[10px] text-zinc-600 font-mono hidden md:block">{new Date(file.created_at).toLocaleDateString()}</span>
                         <button 
                            onClick={() => setDeleteId(file.id)}
                            className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Delete Asset"
                         >
                            <TrashIcon className="w-4 h-4" />
                         </button>
                    </div>
                </div>
             ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion">
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
          Are you sure you want to delete this file? This action will remove it from the vector database and cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
        </div>
      </Modal>
    </div>
  );
};

export default FileList;