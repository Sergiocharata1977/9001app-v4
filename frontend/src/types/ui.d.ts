// Declaraciones de tipos para componentes UI de Radix
declare module '@/components/ui/button' {
  import { ComponentProps, ReactNode } from 'react';
  
  interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
    children: ReactNode;
  }
  
  export const Button: React.FC<ButtonProps>;
}

declare module '@/components/ui/input' {
  import { ComponentProps } from 'react';
  
  interface InputProps extends ComponentProps<'input'> {
    type?: string;
  }
  
  export const Input: React.FC<InputProps>;
}

declare module '@/components/ui/card' {
  import { ComponentProps, ReactNode } from 'react';
  
  interface CardProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  interface CardHeaderProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  interface CardTitleProps extends ComponentProps<'h3'> {
    children: ReactNode;
  }
  
  interface CardDescriptionProps extends ComponentProps<'p'> {
    children: ReactNode;
  }
  
  interface CardContentProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  interface CardFooterProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<CardHeaderProps>;
  export const CardTitle: React.FC<CardTitleProps>;
  export const CardDescription: React.FC<CardDescriptionProps>;
  export const CardContent: React.FC<CardContentProps>;
  export const CardFooter: React.FC<CardFooterProps>;
}

declare module '@/components/ui/badge' {
  import { ComponentProps, ReactNode } from 'react';
  
  interface BadgeProps extends ComponentProps<'div'> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    children: ReactNode;
  }
  
  export const Badge: React.FC<BadgeProps>;
}

declare module '@/components/ui/select' {
  import { ComponentProps, ReactNode } from 'react';
  
  interface SelectProps extends ComponentProps<'div'> {
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  }
  
  interface SelectTriggerProps extends ComponentProps<'button'> {
    children: ReactNode;
  }
  
  interface SelectValueProps extends ComponentProps<'span'> {
    placeholder?: string;
  }
  
  interface SelectContentProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  interface SelectItemProps extends ComponentProps<'div'> {
    value: string;
    children: ReactNode;
  }
  
  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.FC<SelectTriggerProps>;
  export const SelectValue: React.FC<SelectValueProps>;
  export const SelectContent: React.FC<SelectContentProps>;
  export const SelectItem: React.FC<SelectItemProps>;
}

declare module '@/components/ui/dialog' {
  import { ComponentProps, ReactNode } from 'react';
  
  interface DialogProps extends ComponentProps<'div'> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
  }
  
  interface DialogTriggerProps extends ComponentProps<'button'> {
    children: ReactNode;
  }
  
  interface DialogContentProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  interface DialogHeaderProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  interface DialogTitleProps extends ComponentProps<'h2'> {
    children: ReactNode;
  }
  
  interface DialogDescriptionProps extends ComponentProps<'p'> {
    children: ReactNode;
  }
  
  interface DialogFooterProps extends ComponentProps<'div'> {
    children: ReactNode;
  }
  
  export const Dialog: React.FC<DialogProps>;
  export const DialogTrigger: React.FC<DialogTriggerProps>;
  export const DialogContent: React.FC<DialogContentProps>;
  export const DialogHeader: React.FC<DialogHeaderProps>;
  export const DialogTitle: React.FC<DialogTitleProps>;
  export const DialogDescription: React.FC<DialogDescriptionProps>;
  export const DialogFooter: React.FC<DialogFooterProps>;
}

declare module '@/components/ui/label' {
  import { ComponentProps, ReactNode } from 'react';
  
  interface LabelProps extends ComponentProps<'label'> {
    children: ReactNode;
  }
  
  export const Label: React.FC<LabelProps>;
}

declare module '@/components/ui/textarea' {
  import { ComponentProps } from 'react';
  
  interface TextareaProps extends ComponentProps<'textarea'> {
    placeholder?: string;
  }
  
  export const Textarea: React.FC<TextareaProps>;
}

declare module '@/components/ui/progress' {
  import { ComponentProps } from 'react';
  
  interface ProgressProps extends ComponentProps<'div'> {
    value?: number;
    max?: number;
  }
  
  export const Progress: React.FC<ProgressProps>;
}

declare module '@/components/ui/skeleton' {
  import { ComponentProps } from 'react';
  
  interface SkeletonProps extends ComponentProps<'div'> {
    className?: string;
  }
  
  export const Skeleton: React.FC<SkeletonProps>;
}

declare module '@/components/ui/use-toast' {
  export interface Toast {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
  }
  
  export interface ToastActionElement {
    altText?: string;
    action?: React.ReactNode;
  }
  
  export function useToast(): {
    toast: (props: {
      title?: string;
      description?: string;
      action?: ToastActionElement;
      variant?: 'default' | 'destructive';
    }) => void;
    dismiss: (toastId?: string) => void;
  };
}
