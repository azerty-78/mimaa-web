import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number; // ms
}

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  createdAt: number;
  duration: number;
}

interface ToastContextType {
  show: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

const MAX_TOASTS = 3;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const typeStyles: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: 'bg-green-600', icon: '✓' },
  error: { bg: 'bg-red-600', icon: '⚠' },
  info: { bg: 'bg-gray-800', icon: 'ℹ' },
  warning: { bg: 'bg-yellow-600', icon: '!' },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<number, number>>({});

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', options?: ToastOptions) => {
    // Utiliser timestamp + random pour garantir l'unicité
    const id = Date.now() + Math.random();
    const duration = options?.duration ?? 3000;
    const toast: Toast = { id, message, type, createdAt: Date.now(), duration };
    setToasts((prev) => {
      const next = [...prev, toast];
      // limiter le nb affiché
      return next.slice(-MAX_TOASTS);
    });
    timers.current[id] = window.setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  // Nettoyage timers
  useEffect(() => () => {
    Object.values(timers.current).forEach((tid) => window.clearTimeout(tid));
    timers.current = {};
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container */}
      <div className="fixed top-4 right-4 z-[1000] space-y-2 sm:max-w-sm w-[92%] sm:w-auto" aria-live="polite" role="status">
        {toasts.map((t) => {
          const style = typeStyles[t.type];
          const pct = Math.max(0, 1 - (Date.now() - t.createdAt) / t.duration) * 100;
          return (
            <div key={t.id} className={`overflow-hidden rounded shadow text-white ${style.bg} animate-[fadeIn_150ms_ease-out]`}
                 style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
              <div className="px-4 py-3 flex items-start gap-3">
                <span className="mt-0.5 select-none">{style.icon}</span>
                <div className="flex-1 text-sm">{t.message}</div>
                <button className="opacity-80 hover:opacity-100" onClick={() => dismiss(t.id)} aria-label="Fermer">✕</button>
              </div>
              <div className="h-1 bg-black/10">
                <div className="h-1 bg-white/70 transition-[width] duration-100 linear" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

