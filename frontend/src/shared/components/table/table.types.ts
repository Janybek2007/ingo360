/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface ITableProps {
  columns: ColumnDef<any>[];
  data: any[];
  className?: string;
  maxHeight?: number;
  minHeight?: number;
  highlightRow?: (row: any) => string;
  isScrollbar?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  pinnedRow?: (row: any) => boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  loadingNode?: React.ReactNode;
  emptyNode?: React.ReactNode;
}

export interface ITableScrollbarProps {
  thumbWidth: number;
  thumbPosition: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  scrollbarRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
}

export interface ITableBodyProps {
  table: TableType<any>;
  highlightRow?: (row: any) => string;
  pinnedRow?: (row: any) => boolean;
}

export interface ITableHeaderProps {
  table: TableType<any>;
}

export interface IFilterPopupProps {
  column: Column<any, unknown>;
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
  value: (string | number)[];
  setValue: (val: (string | number)[]) => void;
  items: ISelectItem<string | number>[];
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
