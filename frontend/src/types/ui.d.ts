// Tipos para componentes UI

import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// Declaraciones para manejar imports con diferentes casings
declare module '@/components/ui/button' {
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    loading?: boolean;
    children: ReactNode;
  }
  export const Button: React.FC<ButtonProps>;
}

declare module '@/components/ui/Button' {
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    loading?: boolean;
    children: ReactNode;
  }
  export const Button: React.FC<ButtonProps>;
}

declare module '@/components/ui/input' {
  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  }
  export const Input: React.FC<InputProps>;
}

declare module '@/components/ui/Input' {
  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  }
  export const Input: React.FC<InputProps>;
}

declare module '@/components/ui/card' {
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
  }
  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>>;
  export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>>;
  export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>>;
  export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>>;
  export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/Card' {
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
  }
  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>>;
  export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>>;
  export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>>;
  export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>>;
  export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/badge' {
  export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    children: ReactNode;
  }
  export const Badge: React.FC<BadgeProps>;
}

declare module '@/components/ui/Badge' {
  export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    children: ReactNode;
  }
  export const Badge: React.FC<BadgeProps>;
}

declare module '@/components/ui/progress' {
  export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
  }
  export const Progress: React.FC<ProgressProps>;
}

declare module '@/components/ui/Progress' {
  export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
  }
  export const Progress: React.FC<ProgressProps>;
}

// Tipos para Modal
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Tipos para Table
export interface TableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  onRowClick?: (row: T) => void;
}

export interface ColumnDef<T = any> {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string | number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Tipos para Form
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
}

// Tipos para Loading
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'skeleton';
}

// Tipos para Alert
export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  action?: ReactNode;
}

// Tipos para Tooltip
export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

// Tipos para Dropdown
export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
}

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

// Tipos para Tabs
export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

// Tipos para Accordion
export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

// Tipos para DataTable
export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: DataTablePagination;
  sorting?: DataTableSorting;
  filtering?: DataTableFiltering;
  onRowSelect?: (rows: T[]) => void;
  onRowClick?: (row: T) => void;
}

export interface DataTableColumn<T = any> {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTablePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export interface DataTableSorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface DataTableFiltering {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  filterOptions?: Record<string, { value: string; label: string }[]>;
}

// Declaraciones para Alert
declare module '@/components/ui/alert' {
  import { HTMLAttributes, ReactNode } from 'react';
  
  export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive' | 'success';
    children?: ReactNode;
  }
  
  export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
  }
  
  export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export const Alert: React.FC<AlertProps>;
  export const AlertTitle: React.FC<AlertTitleProps>;
  export const AlertDescription: React.FC<AlertDescriptionProps>;
}

// Declaraciones para Alert-Dialog
declare module '@/components/ui/alert-dialog' {
  import { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react';
  
  export interface AlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  }
  
  export interface AlertDialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    asChild?: boolean;
  }
  
  export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export interface AlertDialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export interface AlertDialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
  }
  
  export interface AlertDialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
  }
  
  export interface AlertDialogFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export interface AlertDialogActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
  }
  
  export interface AlertDialogCancelProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
  }
  
  export const AlertDialog: React.FC<AlertDialogProps>;
  export const AlertDialogTrigger: React.FC<AlertDialogTriggerProps>;
  export const AlertDialogContent: React.FC<AlertDialogContentProps>;
  export const AlertDialogHeader: React.FC<AlertDialogHeaderProps>;
  export const AlertDialogTitle: React.FC<AlertDialogTitleProps>;
  export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps>;
  export const AlertDialogFooter: React.FC<AlertDialogFooterProps>;
  export const AlertDialogAction: React.FC<AlertDialogActionProps>;
  export const AlertDialogCancel: React.FC<AlertDialogCancelProps>;
}

// Declaraciones para Separator
declare module '@/components/ui/separator' {
  import { HTMLAttributes } from 'react';
  
  export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
  
  export const Separator: React.FC<SeparatorProps>;
}

// Declaraciones para Avatar
declare module '@/components/ui/avatar' {
  import { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
  
  export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
  }
  
  export interface AvatarFallbackProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }
  
  export const Avatar: React.FC<AvatarProps>;
  export const AvatarImage: React.FC<AvatarImageProps>;
  export const AvatarFallback: React.FC<AvatarFallbackProps>;
}

// Declaraciones para Skeleton
declare module '@/components/ui/skeleton' {
  import { HTMLAttributes, ReactNode } from 'react';
  
  export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: ReactNode;
  }
  
  export const Skeleton: React.FC<SkeletonProps>;
  
  // Skeleton components específicos
  export const PersonalCardSkeleton: React.FC<{ cards?: number }>;
  export const PersonalListSkeleton: React.FC<{ rows?: number }>;
  export const PersonalSingleSkeleton: React.FC;
  export const TableSkeleton: React.FC<{ rows?: number; columns?: number }>;
  export const HeaderSkeleton: React.FC;
  export const FormSkeleton: React.FC;
  export const PuestoCardSkeleton: React.FC<{ cards?: number }>;
  export const AuditoriaSkeleton: React.FC;
  export const AuditoriaFormSkeleton: React.FC;
  export const CapacitacionSkeleton: React.FC;
  export const CapacitacionFormSkeleton: React.FC;
  export const HallazgoSkeleton: React.FC;
  export const HallazgoFormSkeleton: React.FC;
  export const DocumentoFormSkeleton: React.FC;
}

export { };

