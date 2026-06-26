import { useState, useCallback } from 'react';
import type { Toast } from '@/types';

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((msg: string, type: Toast['type'] = 'info', dur = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), dur);
  }, []);

  return { toasts, toast: add };
}
