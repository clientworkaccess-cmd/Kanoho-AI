export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  github_connected: boolean;
  slack_connected: boolean;
  avatar_url: string | null;
  updated_at: string;
}

export interface FileRecord {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  size_mb: number | null;
  status: 'processing' | 'processed' | 'failed';
  video_url: string | null;
  mime_type: string | null;
  upload_date: string;
  created_at: string;
}

export type UploadTab = 'document' | 'audio' | 'transcript';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}