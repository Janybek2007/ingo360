import {
  type ColumnFiltersState,
  type ColumnPinningState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useRef, useState } from 'react';

import { useTableScrollbar } from '#/shared/hooks/use-table-scrollbar';
import { cn } from '#/shared/utils/cn';

import type { ITableProps } from './table.types';
import { TableBody } from './ui/table-body.ui';
import { TableHeader } from './ui/table-header.ui';
import { TableScrollbar } from './ui/table-scrollbar.ui';

export const Table: React.FC<ITableProps> = React.memo(
  ({
    columns,
    data,
    className = '',
    maxHeight = 500,
    minHeight = 'auto',
    isScrollbar = false,
    rounded = 'lg',
    highlightRow,
    pinnedRow,
    isLoading,
    isEmpty,
    loadingNode,
    emptyNode,
  }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
      () => {
        const leftPinnedColumns = columns
          .filter(col => col.enablePinning)
          .map(col => col.id || String(col.accessorKey) || '');
        return { left: leftPinnedColumns, right: [] };
      }
    );

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

    const showEmpty = isEmpty || data.length === 0;

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
          style={{ maxHeight, minHeight }}
        >
          <table
            id="custom-table"
            className="w-full text-sm border-separate border-spacing-0"
          >
            <TableHeader table={table} />
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="py-14 text-center">
                    {loadingNode || 'Загрузка...'}
                  </td>
                </tr>
              </tbody>
            ) : showEmpty ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="py-14 text-center">
                    {emptyNode || 'Отсутствуют данные'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <TableBody
                table={table}
                highlightRow={highlightRow}
                pinnedRow={pinnedRow}
              />
            )}
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
);

Table.displayName = '_Table_';
