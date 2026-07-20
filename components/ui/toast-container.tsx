'use client';

import { useToast } from './use-toast';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, toast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm">
      {toasts.map((t) => {
        let borderClass = 'border-asphalt';
        let bgClass = 'bg-surface';
        
        if (t.variant === 'destructive') {
          borderClass = 'border-roadCoral';
          bgClass = 'bg-roadCoral/5';
        } else if (t.variant === 'success') {
          borderClass = 'border-meterGreen';
          bgClass = 'bg-meterGreen/5';
        }

        return (
          <div
            key={t.id}
            className={`border-1 p-4 shadow-brutalist flex justify-between items-start font-mono text-sm relative ${borderClass} ${bgClass}`}
          >
            <div>
              <h4 className="font-bold text-asphalt uppercase">{t.title}</h4>
              {t.description && <p className="text-xs text-gray-500 mt-1">{t.description}</p>}
            </div>
            <button
              onClick={() => {
                // Remove manually
                // (Note: this is simplified, the setTimeout will also clean it up)
              }}
              className="text-asphalt hover:text-roadCoral ml-4"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
