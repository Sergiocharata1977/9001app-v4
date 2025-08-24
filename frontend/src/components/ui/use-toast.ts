import { useState, useEffect } from "react";

const TOAST_LIMIT = 1;

// removed unused actionTypes

let count = 0;

function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  dismiss?: () => void;
  update?: (props: Partial<ToastProps>) => void;
}

interface ToastState {
  toasts: ToastProps[];
}

// removed unused toastTimeouts map

export function useToast() {
  const [state, setState] = useState<ToastState>({
    toasts: [],
  });

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    state.toasts.forEach((toast) => {
      if (toast.duration === Infinity) {
        return;
      }

      const timeout = setTimeout(() => {
        if (toast.dismiss) {
          toast.dismiss();
        }
      }, toast.duration || 5000);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [state.toasts]);

  function toast(props: Omit<ToastProps, 'id' | 'dismiss' | 'update'>): {
    id: string;
    dismiss: () => void;
    update: (props: Partial<ToastProps>) => void;
  } {
    const id = generateId();

    const update = (updateProps: Partial<ToastProps>) =>
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, ...updateProps } : t
        ),
      }));

    const dismiss = () => setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));

    setState((state) => ({
      ...state,
      toasts: [
        { ...props, id, dismiss },
        ...state.toasts,
      ].slice(0, TOAST_LIMIT),
    }));

    return {
      id,
      dismiss,
      update,
    };
  }

  return {
    toast,
    toasts: state.toasts,
  };
}
