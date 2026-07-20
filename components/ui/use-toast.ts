'use client';

import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

type Listener = (toasts: ToastMessage[]) => void;
const listeners = new Set<Listener>();
let memoryToasts: ToastMessage[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...memoryToasts]));
}

export function toast(message: Omit<ToastMessage, 'id'>) {
  const id = `toast-${Date.now()}`;
  const newToast = { id, ...message };
  memoryToasts = [newToast, ...memoryToasts].slice(0, 5); // limit to 5 active toasts
  notifyListeners();

  // Auto-remove after 4 seconds
  setTimeout(() => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => {
      setToasts(newToasts);
    };
    listeners.add(listener);
    setToasts(memoryToasts);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    toasts,
    toast,
  };
}
