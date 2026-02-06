import {
  type ColumnPinningState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { Suspense, useContext, useEffect, useRef } from 'react';

import { FiltersContext } from '#/shared/context/filters';
import { cn } from '#/shared/utils/cn';

import { LucideAlertCircleIcon } from '../../assets/icons';
import { UsedFilter } from '../used-filter';
import type { ITableProps } from './table.types';
import { TableBody } from './ui/table-body.ui';
import { TableHeader } from './ui/table-header.ui';
import { formatUsedFilterItems } from './utils/format-used-filters';

export const Table: React.FC<ITableProps> = React.memo(
  ({
    columns,
    data,
    className = '',
    maxHeight = 500,
    minHeight = 'auto',
    rounded = 'lg',
    highlightRow,
    pinnedRow,
    filters,
    rowTotal,
    enableColumnResizing = true,
    isViewFilter = true,
    isVirtualized = true,
  }) => {
    const filt = useContext(FiltersContext);

    const columnFilters = filt.filters || filters?.custom;
    const setColumnFilters = filt.setFilters;

    const sorting = filt.sorting;
    const setSorting = filt.setSorting;

    const columnPinning = React.useMemo<ColumnPinningState>(() => {
      const leftPinnedColumns = columns
        .filter(
          col =>
            col.enablePinning &&
            (col.pinned === 'left' || col.pinned === undefined)
        )
        .map(col => col.id || String(col.accessorKey) || '');
      const rightPinnedColumns = columns
        .filter(col => col.enablePinning && col.pinned === 'right')
        .map(col => col.id || String(col.accessorKey) || '');
      return { left: leftPinnedColumns, right: rightPinnedColumns };
    }, [columns]);

    useEffect(() => {
      if (!filters?.custom) return;

      setSorting([]);
      setColumnFilters(filters.custom);
    }, [filters?.custom, setColumnFilters, setSorting]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
      data,
      columns,
      state: { sorting, columnFilters, columnPinning },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      // getSortedRowModel: getSortedRowModel(),
      // getFilteredRowModel: getFilteredRowModel(),
      columnResizeMode: 'onChange',
      defaultColumn: { size: 200, enableResizing: enableColumnResizing },
      enableColumnResizing,
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
      count: table.getRowModel().rows.length,
      getScrollElement: () => tableContainerRef.current,
      estimateSize: () => 50,
      overscan: data.length > 1000 ? 10 : 5,
      enabled: isVirtualized,
      measureElement:
        typeof window !== 'undefined' &&
        navigator.userAgent.indexOf('Firefox') === -1
          ? element => element?.getBoundingClientRect().height
          : undefined,
    });

    const allUsedFilters = React.useMemo(
      () =>
        isViewFilter
          ? formatUsedFilterItems({
              columnFilters,
              sorting,
              columns,
              externalUsedFilters: filters?.usedFilterItems,
              setColumnFilters,
              setSorting,
            })
          : [],
      [
        isViewFilter,
        columnFilters,
        sorting,
        columns,
        filters?.usedFilterItems,
        setColumnFilters,
        setSorting,
      ]
    );

    const handleResetFilters = React.useCallback(() => {
      setColumnFilters([]);
      setSorting([]);
      filters?.resetFilters();
    }, [filters, setColumnFilters, setSorting]);

    return (
      <div className={cn('relative', className)}>
        {(filters || columnFilters.length > 0 || sorting.length > 0) &&
          isViewFilter && (
            <UsedFilter
              {...filters}
              usedFilterItems={allUsedFilters}
              resetFilters={handleResetFilters}
              className="mb-3"
            />
          )}
        <div
          ref={tableContainerRef}
          className={cn(
            'bg-white border border-[#E4E4E4] font-inter',
            'overflow-x-auto overflow-y-auto',
            rounded == 'sm' && 'rounded-sm',
            rounded == 'md' && 'rounded-md',
            rounded == 'lg' && 'rounded-lg',
            allUsedFilters.length > 0 && 'mt-5'
          )}
          style={{ maxHeight, minHeight, position: 'relative', zIndex: 1 }}
        >
          {table.getRowModel().rows.length === 0 ? (
            <DefaultEmpty />
          ) : (
            <table
              id="custom-table"
              className="text-sm border-separate border-spacing-0 w-full min-w-max"
            >
              <Suspense fallback={<thead></thead>}>
                <TableHeader table={table} />
              </Suspense>
              <Suspense fallback={<tbody></tbody>}>
                <TableBody
                  table={table}
                  highlightRow={highlightRow}
                  pinnedRow={pinnedRow}
                  rowTotal={rowTotal}
                  rowVirtualizer={rowVirtualizer}
                  isVirtualized={isVirtualized}
                />
              </Suspense>
            </table>
          )}
        </div>
      </div>
    );
  }
);

const DefaultEmpty = React.memo(() => (
  <div className="flex flex-col items-center justify-center my-40 px-4 text-center text-gray-500 space-y-3">
    <LucideAlertCircleIcon className="text-gray-400 size-[36px]" />
    <p className="font-medium text-base">Нет данных для отображения</p>
    <p className="text-sm text-gray-400 max-w-sm">
      Попробуйте изменить фильтры.
    </p>
  </div>
));

DefaultEmpty.displayName = 'DefaultEmpty';
Table.displayName = '_Table_';
