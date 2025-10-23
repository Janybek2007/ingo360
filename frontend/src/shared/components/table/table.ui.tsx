import {
  type ColumnFiltersState,
  type ColumnPinningState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
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
    enableColumnResizing = true,
  }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
      filters?.custom || []
    );
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
      setColumnFilters(filters?.custom || []);
    }, [data, columns, filters?.custom]);

    // eslint-disable-next-line react-hooks/incompatible-library
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
      defaultColumn: { size: 200, enableResizing: enableColumnResizing },
      enableColumnResizing,
    });

    const tableContainerRef = useRef<HTMLTableElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const { thumbWidth, thumbPosition, onThumbMouseDown, isDragging } =
      useTableScrollbar(tableContainerRef, scrollbarRef, isScrollbar);

    const rowVirtualizer = useVirtualizer({
      count: table.getRowModel().rows.length,
      getScrollElement: () => tableContainerRef.current,
      estimateSize: () => 50,
      overscan: 5,
    });

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
            'bg-white noscrollbar border border-l-0 border-[#E4E4E4] font-inter',
            'overflow-x-auto overflow-y-auto',
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
          {columns.length === 0 || isLoading || showEmpty ? (
            <TableState
              state={
                columns.length === 0
                  ? 'not-columns'
                  : isLoading
                    ? 'loading'
                    : 'empty'
              }
              loadingNode={loadingNode}
              emptyNode={emptyNode}
            />
          ) : (
            <>
              <table
                id="custom-table"
                className="text-sm border-separate border-spacing-0 w-full min-w-max"
              >
                <TableHeader table={table} />
                <TableBody
                  table={table}
                  highlightRow={highlightRow}
                  pinnedRow={pinnedRow}
                  rowTotal={rowTotal}
                  rowVirtualizer={rowVirtualizer}
                />
              </table>
            </>
          )}
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
  loadingNode?: React.ReactNode;
  emptyNode?: React.ReactNode;
}> = React.memo(({ state, loadingNode, emptyNode }) => {
  return state === 'not-columns' ? (
    <div className="py-20 text-center text-gray-500">
      Нет выбранных колонок для отображения
    </div>
  ) : state === 'loading' ? (
    <div className="py-20 text-center">{loadingNode || 'Загрузка...'}</div>
  ) : (
    <div className="py-20 text-center">{emptyNode || 'Отсутствуют данные'}</div>
  );
});

TableState.displayName = '_TableState_';
Table.displayName = '_Table_';
