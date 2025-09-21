import type { ColumnDef, Table as TableType } from '@tanstack/react-table';

export interface ITableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
  maxHeight?: number;
  highlightRow?: (row: T) => string;
  isScrollbar?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg';
}

export interface TableScrollbarProps {
  thumbWidth: number;
  thumbPosition: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  scrollbarRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
}

export interface TableBodyProps<T> {
  table: TableType<T>;
  highlightRow?: (row: T) => string;
}

export interface TableHeaderProps<T> {
  table: TableType<T>;
}
