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

export { };

