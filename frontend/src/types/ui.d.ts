// Tipos generales para componentes UI

import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

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

export { };

