import {
  type ColumnFiltersState,
  type ColumnPinningState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useRef, useState } from 'react';

import { useTableScrollbar } from '#/shared/hooks/use-table-scrollbar';
import { cn } from '#/shared/utils/cn';

import { UsedFilter } from '../used-filter';
import type { ITableProps } from './table.types';
import { TableBody } from './ui/table-body.ui';
import { TableHeader } from './ui/table-header.ui';
import { TableScrollbar } from './ui/table-scrollbar.ui';
import { formatUsedItems } from './utils/format-used-items';

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
    filters,
    rowTotal,
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

    useEffect(() => {
      setSorting([]);
      setColumnFilters([]);
    }, [data, columns]);

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
      defaultColumn: { size: 200, minSize: 100 },
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const { thumbWidth, thumbPosition, onThumbMouseDown, isDragging } =
      useTableScrollbar(tableContainerRef, scrollbarRef, isScrollbar);

    const showEmpty = isEmpty || data.length === 0;

    const allUsedItems = React.useMemo(
      () =>
        formatUsedItems({
          columnFilters,
          sorting,
          columns,
          externalUsedItems: filters?.usedItems,
          setColumnFilters,
          setSorting,
        }),
      [filters?.usedItems, columnFilters, sorting, columns]
    );

    const handleResetFilters = React.useCallback(() => {
      setColumnFilters([]);
      setSorting([]);
      filters?.resetFilters();
    }, [filters]);

    return (
      <div className={cn('relative', className)}>
        {(filters || columnFilters.length > 0 || sorting.length > 0) && (
          <UsedFilter
            usedItems={allUsedItems}
            resetFilters={handleResetFilters}
          />
        )}
        <div
          ref={tableContainerRef}
          className={cn(
            'overflow-auto bg-white noscrollbar border border-[#E4E4E4] font-inter',
            rounded == 'sm' && 'rounded-sm',
            rounded == 'md' && 'rounded-md',
            rounded == 'lg' && 'rounded-lg',
            allUsedItems.length > 0 && 'mt-5'
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
                rowTotal={rowTotal}
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
