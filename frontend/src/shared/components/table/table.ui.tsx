import {
  type ColumnFiltersState,
  type ColumnPinningState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useRef, useState } from 'react';

import { useTableScrollbar } from '#/shared/hooks/use-table-scrollbar';
import { cn } from '#/shared/utils/cn';

import type { ITableProps } from './table.types';
import { TableBody } from './ui/table-body.ui';
import { TableHeader } from './ui/table-header.ui';
import { TableScrollbar } from './ui/table-scrollbar.ui';

export function Table<T extends object>({
  columns,
  data,
  className = '',
  maxHeight = 500,
  isScrollbar = false,
  rounded = 'lg',
  highlightRow,
  pinnedRow,
}: ITableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => {
    const leftPinnedColumns = columns
      .filter(col => col.enablePinning)
      .map(col => col.id || String(col.accessorKey) || '');
    return { left: leftPinnedColumns, right: [] };
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnPinning },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: 'onChange',
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const { thumbWidth, thumbPosition, onThumbMouseDown, isDragging } =
    useTableScrollbar(tableContainerRef, scrollbarRef, isScrollbar);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={tableContainerRef}
        className={cn(
          'overflow-auto bg-white noscrollbar border border-[#E4E4E4] font-inter',
          rounded == 'sm' && 'rounded-sm',
          rounded == 'md' && 'rounded-md',
          rounded == 'lg' && 'rounded-lg'
        )}
        style={{ maxHeight }}
      >
        <table
          id="custom-table"
          className="w-full text-sm border-separate border-spacing-0"
        >
          <TableHeader table={table} />
          <TableBody
            table={table}
            highlightRow={highlightRow}
            pinnedRow={pinnedRow}
          />
        </table>
      </div>

      {isScrollbar && (
        <TableScrollbar
          scrollbarRef={scrollbarRef}
          thumbWidth={thumbWidth}
          thumbPosition={thumbPosition}
          onMouseDown={onThumbMouseDown}
          isDragging={isDragging}
        />
      )}
    </div>
  );
}

Table.displayName = '_Table_';
