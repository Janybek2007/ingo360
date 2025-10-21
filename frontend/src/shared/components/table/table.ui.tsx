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
import { formatUsedFilterItems } from './utils/format-used-filters';

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
    isLoading = false,
    isEmpty = false,
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
      defaultColumn: { minSize: 40 },
      columnResizeMode: 'onChange',
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const { thumbWidth, thumbPosition, onThumbMouseDown, isDragging } =
      useTableScrollbar(tableContainerRef, scrollbarRef, isScrollbar);

    const showEmpty =
      isEmpty ||
      data.length === 0 ||
      table.getFilteredRowModel().rows.length === 0;

    const allUsedFilters = React.useMemo(
      () =>
        formatUsedFilterItems({
          columnFilters,
          sorting,
          columns,
          externalUsedFilters: filters?.usedFilterItems,
          setColumnFilters,
          setSorting,
        }),
      [filters?.usedFilterItems, columnFilters, sorting, columns]
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
            usedFilterItems={allUsedFilters}
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
            allUsedFilters.length > 0 && 'mt-5'
          )}
          style={{
            maxHeight,
            minHeight,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <table
            id="custom-table"
            className="w-full text-sm border-separate border-spacing-0"
          >
            {columns.length === 0 || isLoading || showEmpty ? (
              <TableState
                state={
                  columns.length === 0
                    ? 'not-columns'
                    : isLoading
                      ? 'loading'
                      : 'empty'
                }
                colSpan={columns.length}
                loadingNode={loadingNode}
                emptyNode={emptyNode}
              />
            ) : (
              <>
                <TableHeader table={table} />
                <TableBody
                  table={table}
                  highlightRow={highlightRow}
                  pinnedRow={pinnedRow}
                  rowTotal={rowTotal}
                />
              </>
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

const TableState: React.FC<{
  state: 'not-columns' | 'loading' | 'empty';
  colSpan: number;
  loadingNode?: React.ReactNode;
  emptyNode?: React.ReactNode;
}> = React.memo(({ state, colSpan, loadingNode, emptyNode }) => {
  return state === 'not-columns' ? (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-14 text-center text-gray-500">
          Нет выбранных колонок для отображения
        </td>
      </tr>
    </tbody>
  ) : state === 'loading' ? (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-14 text-center">
          {loadingNode || 'Загрузка...'}
        </td>
      </tr>
    </tbody>
  ) : (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-14 text-center">
          {emptyNode || 'Отсутствуют данные'}
        </td>
      </tr>
    </tbody>
  );
});

TableState.displayName = '_TableState_';
Table.displayName = '_Table_';
