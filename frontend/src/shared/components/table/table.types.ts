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
import type { Virtualizer } from '@tanstack/react-virtual';

import type { IAnchorPosition } from '#/shared/hooks/use-anchor-position';

import type { ISelectItem } from '../ui/select';
import type { IUsedFilterProps } from '../used-filter';

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
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  highlightRow?: ITableBodyProps['highlightRow'];
  pinnedRow?: ITableBodyProps['pinnedRow'];
  enableColumnResizing?: boolean;
  filters?: IUsedFilterProps & {
    custom?: ColumnFiltersState;
  };
  rowTotal?: ITableBodyProps['rowTotal'];
}

export interface ITableBodyProps {
  table: TableType<any>;
  highlightRow?: (row: any) => string;
  pinnedRow?: (row: any) => boolean;
  rowTotal?: {
    firstColSpan: number;
    monthTotals?: number[];
    grandTotal?: number;
  };
  rowVirtualizer?: Virtualizer<any, any>;
}

export interface ITableHeaderProps {
  table: TableType<any>;
}

export interface IFilterPopupProps {
  column: Column<any, unknown>;
  onClose: VoidFunction;
  popupPosition: TableContextProps['popupPosition'];
}

export interface ISortButtonsProps {
  isSorted: SortDirection;
  toggleSorting: (asc: boolean) => void;
  resetSorting: VoidFunction;
}

export interface IFilterActionsProps {
  onClose: VoidFunction;
  onApply: VoidFunction;
}

export interface IFilterSelectProps {
  value: ISelectItem<string | number>[];
  setValue: (val: ISelectItem<string | number>[]) => void;
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
