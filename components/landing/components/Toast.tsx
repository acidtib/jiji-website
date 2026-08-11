import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-lime-500/40 text-zinc-100 px-4 py-3 rounded-lg shadow-2xl shadow-lime-950/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
      {type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
      <span className="text-sm font-medium font-mono">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
