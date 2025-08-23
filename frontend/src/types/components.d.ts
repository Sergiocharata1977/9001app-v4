// Declaraciones de tipos para componentes UI adicionales

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

// Declaraciones para componentes custom
declare module '@/components/ui/confirm-dialog' {
  export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'default' | 'destructive';
  }
  
  export const ConfirmDialog: React.FC<ConfirmDialogProps>;
}

// Declaraciones para DataTable
declare module '@/components/ui/DataTable' {
  export interface DataTableProps<T = any> {
    data: T[];
    columns: Array<{
      key: string;
      header: string;
      accessorKey?: keyof T;
      cell?: (value: any, row: T) => ReactNode;
      sortable?: boolean;
    }>;
    loading?: boolean;
    onRowClick?: (row: T) => void;
    pagination?: {
      currentPage: number;
      totalPages: number;
      onPageChange: (page: number) => void;
    };
  }
  
  export function DataTable<T = any>(props: DataTableProps<T>): JSX.Element;
}

// Declaraciones para FormBuilder
declare module '@/components/ui/FormBuilder' {
  export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    validation?: any;
  }
  
  export interface FormBuilderProps {
    fields: FormField[];
    onSubmit: (data: any) => void;
    defaultValues?: Record<string, any>;
    submitText?: string;
    cancelText?: string;
    onCancel?: () => void;
  }
  
  export const FormBuilder: React.FC<FormBuilderProps>;
}

// Declaraciones para GenericCard
declare module '@/components/ui/GenericCard' {
  export interface GenericCardProps {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    actions?: ReactNode;
    children?: ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
    onClick?: () => void;
  }
  
  export const GenericCard: React.FC<GenericCardProps>;
}

// Declaraciones para MermaidDiagram
declare module '@/components/ui/MermaidDiagram' {
  export interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
  }
  
  export const MermaidDiagram: React.FC<MermaidDiagramProps>;
}

// Declaraciones para Pagination
declare module '@/components/ui/Pagination' {
  export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPageNumbers?: boolean;
    maxPageNumbers?: number;
  }
  
  export const Pagination: React.FC<PaginationProps>;
}

// Declaraciones para PlanBadge
declare module '@/components/ui/PlanBadge' {
  export interface PlanBadgeProps {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    size?: 'sm' | 'md' | 'lg';
  }
  
  export const PlanBadge: React.FC<PlanBadgeProps>;
}

// Declaraciones para use-toast hook
declare module '@/components/ui/use-toast' {
  export interface ToastOptions {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
    action?: ReactNode;
  }
  
  export interface ToastState {
    toasts: ToastOptions[];
  }
  
  export function useToast(): {
    toast: (options: ToastOptions) => void;
    toasts: ToastOptions[];
    dismiss: (id?: string) => void;
  };
}

// Declaraciones para componentes JSX sin archivos .tsx
declare module '@/components/ui/tabs' {
  export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children?: ReactNode;
  }
  
  export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children?: ReactNode;
  }
  
  export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    children?: ReactNode;
  }
  
  export const Tabs: React.FC<TabsProps>;
  export const TabsList: React.FC<TabsListProps>;
  export const TabsTrigger: React.FC<TabsTriggerProps>;
  export const TabsContent: React.FC<TabsContentProps>;
}

declare module '@/components/ui/radio-group' {
  export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    children?: ReactNode;
  }
  
  export interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    value: string;
  }
  
  export const RadioGroup: React.FC<RadioGroupProps>;
  export const RadioGroupItem: React.FC<RadioGroupItemProps>;
}

declare module '@/components/ui/dropdown-menu' {
  export interface DropdownMenuProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  }
  
  export interface DropdownMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    asChild?: boolean;
  }
  
  export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }
  
  export interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    onSelect?: () => void;
  }
  
  export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}
  
  export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export const DropdownMenu: React.FC<DropdownMenuProps>;
  export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps>;
  export const DropdownMenuContent: React.FC<DropdownMenuContentProps>;
  export const DropdownMenuItem: React.FC<DropdownMenuItemProps>;
  export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps>;
  export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps>;
}

declare module '@/components/ui/popover' {
  export interface PopoverProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  }
  
  export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    asChild?: boolean;
  }
  
  export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }
  
  export const Popover: React.FC<PopoverProps>;
  export const PopoverTrigger: React.FC<PopoverTriggerProps>;
  export const PopoverContent: React.FC<PopoverContentProps>;
}

declare module '@/components/ui/tooltip' {
  export interface TooltipProviderProps {
    children?: ReactNode;
    delayDuration?: number;
  }
  
  export interface TooltipProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  }
  
  export interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    asChild?: boolean;
  }
  
  export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }
  
  export const TooltipProvider: React.FC<TooltipProviderProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const TooltipTrigger: React.FC<TooltipTriggerProps>;
  export const TooltipContent: React.FC<TooltipContentProps>;
}

declare module '@/components/ui/scroll-area' {
  export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
  }
  
  export const ScrollArea: React.FC<ScrollAreaProps>;
  export const ScrollBar: React.FC<HTMLAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/calendar' {
  export interface CalendarProps {
    mode?: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from?: Date; to?: Date };
    onSelect?: (date: Date | Date[] | { from?: Date; to?: Date } | undefined) => void;
    disabled?: (date: Date) => boolean;
    className?: string;
  }
  
  export const Calendar: React.FC<CalendarProps>;
}

declare module '@/components/ui/collapsible' {
  export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  }
  
  export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    asChild?: boolean;
  }
  
  export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export const Collapsible: React.FC<CollapsibleProps>;
  export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps>;
  export const CollapsibleContent: React.FC<CollapsibleContentProps>;
}

declare module '@/components/ui/accordion' {
  export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    type?: 'single' | 'multiple';
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    defaultValue?: string | string[];
    children?: ReactNode;
  }
  
  export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    children?: ReactNode;
  }
  
  export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
  }
  
  export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export const Accordion: React.FC<AccordionProps>;
  export const AccordionItem: React.FC<AccordionItemProps>;
  export const AccordionTrigger: React.FC<AccordionTriggerProps>;
  export const AccordionContent: React.FC<AccordionContentProps>;
}

declare module '@/components/ui/toast' {
  export interface ToastProps {
    id?: string;
    title?: string;
    description?: string;
    action?: ReactNode;
    variant?: 'default' | 'destructive';
    duration?: number;
  }
  
  export interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  }
  
  export const Toast: React.FC<ToastProps>;
  export const Toaster: React.FC<ToasterProps>;
}

// Declaraciones para rutas relativas de componentes UI
// Algunas importaciones usan rutas relativas en lugar de alias
declare module '../../ui/button' {
  export * from '@/components/ui/button';
}

declare module '../../ui/input' {
  export * from '@/components/ui/input';
}

declare module '../../ui/label' {
  export * from '@/components/ui/label';
}

declare module '../../ui/select' {
  export * from '@/components/ui/select';
}

declare module '../../ui/card' {
  export * from '@/components/ui/card';
}

declare module '../../ui/badge' {
  export * from '@/components/ui/badge';
}

declare module '../../ui/dialog' {
  export * from '@/components/ui/dialog';
}

declare module '../../ui/textarea' {
  export * from '@/components/ui/textarea';
}

declare module '../../ui/checkbox' {
  export * from '@/components/ui/checkbox';
}

declare module '../../ui/alert' {
  export * from '@/components/ui/alert';
}

declare module '../../ui/separator' {
  export * from '@/components/ui/separator';
}

declare module '../../ui/avatar' {
  export * from '@/components/ui/avatar';
}

declare module '../../ui/skeleton' {
  export * from '@/components/ui/skeleton';
}

declare module '../../ui/table' {
  export * from '@/components/ui/table';
}

declare module '../../ui/tabs' {
  export * from '@/components/ui/tabs';
}

declare module '../../ui/progress' {
  export * from '@/components/ui/progress';
}

declare module '../../ui/dropdown-menu' {
  export * from '@/components/ui/dropdown-menu';
}

declare module '../../ui/popover' {
  export * from '@/components/ui/popover';
}

declare module '../../ui/tooltip' {
  export * from '@/components/ui/tooltip';
}

declare module '../../ui/scroll-area' {
  export * from '@/components/ui/scroll-area';
}

declare module '../../ui/calendar' {
  export * from '@/components/ui/calendar';
}

declare module '../../ui/collapsible' {
  export * from '@/components/ui/collapsible';
}

declare module '../../ui/accordion' {
  export * from '@/components/ui/accordion';
}

declare module '../../ui/radio-group' {
  export * from '@/components/ui/radio-group';
}

declare module '../../ui/alert-dialog' {
  export * from '@/components/ui/alert-dialog';
}

declare module '../../ui/toast' {
  export * from '@/components/ui/toast';
}

declare module '../../ui/use-toast' {
  export * from '@/components/ui/use-toast';
}

export {};