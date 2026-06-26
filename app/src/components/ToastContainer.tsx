import { Icon } from './Icon';
import type { Toast } from '@/types';

interface ToastContainerProps {
  toasts: Toast[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium
            backdrop-blur-xl border shadow-lg animate-in slide-in-from-bottom-3 fade-in duration-300
            ${t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/25 text-emerald-400' : ''}
            ${t.type === 'error' ? 'bg-red-950/90 border-red-500/25 text-red-400' : ''}
            ${t.type === 'info' ? 'bg-indigo-950/90 border-indigo-500/25 text-indigo-400' : ''}
            ${t.type === 'warn' ? 'bg-amber-950/90 border-amber-500/25 text-amber-400' : ''}
          `}
        >
          {t.type === 'success' && <Icon name="check" size={13} />}
          {t.type === 'error' && <Icon name="x" size={13} />}
          {t.type === 'info' && <Icon name="info" size={13} />}
          {t.type === 'warn' && <Icon name="alert" size={13} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
