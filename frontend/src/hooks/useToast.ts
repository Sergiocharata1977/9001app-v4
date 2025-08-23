import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: React.ReactNode;
}

export interface ToastActionElement {
  altText?: string;
  action?: React.ReactNode;
}

interface UseToastReturn {
  toast: (props: {
    title?: string;
    description?: string;
    action?: ToastActionElement;
    variant?: 'default' | 'destructive';
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }) => void;
  dismiss: (toastId?: string) => void;
  toasts: Toast[];
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({
    title,
    description,
    action,
    variant = 'default',
    type = 'info',
    duration = 5000
  }: {
    title?: string;
    description?: string;
    action?: ToastActionElement;
    variant?: 'default' | 'destructive';
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      title,
      description,
      type: variant === 'destructive' ? 'error' : type,
      duration,
      action: action?.action
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts(prev => prev.filter(toast => toast.id !== toastId));
    } else {
      setToasts([]);
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts
  };
}

// Hook simplificado para compatibilidad
export const useToastSimple = () => {
  const { toast, dismiss } = useToast();
  
  return {
    toast: (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
      toast(props);
    },
    dismiss
  };
};

export default useToast;
