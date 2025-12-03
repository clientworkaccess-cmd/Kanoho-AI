import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl transition-all animate-in slide-in-from-right-full duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
            {toast.type === 'error' && <XCircleIcon className="w-5 h-5" />}
            {toast.type === 'info' && <InformationCircleIcon className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};