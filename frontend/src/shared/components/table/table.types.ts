import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  SortDirection,
  SortingState,
  Table as TableType,
} from '@tanstack/react-table';

import type { IAnchorPosition } from '#/shared/hooks/use-anchor-position';

import type { ISelectItem } from '../ui/select';

// Context

export interface TableContextProps {
  sorting: SortingState;
  setSorting: (val: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (val: ColumnFiltersState) => void;
  columnPinning: ColumnPinningState;
  setColumnPinning: (val: ColumnPinningState) => void;
  openFilterColumn: string | null;
  setOpenFilterColumn: (id: string | null) => void;
  popupPosition: IAnchorPosition;
  setPopupPosition: (e: React.MouseEvent<HTMLElement>) => void;
}

// Context

export interface ITableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
  maxHeight?: number;
  highlightRow?: (row: T) => string;
  isScrollbar?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  emptyNode?: React.ReactNode;
  pinnedRow?: (row: T) => boolean;
}

export interface ITableScrollbarProps {
  thumbWidth: number;
  thumbPosition: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  scrollbarRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
}

export interface ITableBodyProps<T> {
  table: TableType<T>;
  highlightRow?: (row: T) => string;
  pinnedRow?: (row: T) => boolean;
}

export interface ITableHeaderProps<T> {
  table: TableType<T>;
}

export interface IFilterPopupProps<T> {
  column: Column<T, unknown>;
  onClose: () => void;
  popupPosition: TableContextProps['popupPosition'];
}

export interface ISortButtonsProps {
  isSorted: SortDirection;
  toggleSorting: (asc: boolean) => void;
}

export interface IFilterActionsProps {
  onClose: VoidFunction;
  onApply: VoidFunction;
  reset: VoidFunction;
}

export interface IFilterSelectProps {
  value: string[];
  setValue: (val: string[]) => void;
  items: ISelectItem[];
}

export interface IFilterInputProps {
  filterType: string;
  setFilterType: (v: string) => void;
  filterItems: ISelectItem[];
  colType: string;
  value: string | number;
  setValue: (v: string | number) => void;
  value2: string | number;
  setValue2: (v: string | number) => void;
}
