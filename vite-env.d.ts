interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  readonly VITE_GITHUB_CLIENT_ID: string;
  readonly VITE_GITHUB_CLIENT_SECRET: string;

  readonly VITE_SLACK_CLIENT_ID: string;
  readonly VITE_SLACK_CLIENT_SECRET: string;

  readonly VITE_WEBHOOK_GENERAL: string;
  readonly VITE_WEBHOOK_AUDIO: string;
  readonly VITE_WEBHOOK_GITHUB: string;
  readonly VITE_WEBHOOK_SLACK: string;
  readonly VITE_WEBHOOK_DELETE_FILE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}