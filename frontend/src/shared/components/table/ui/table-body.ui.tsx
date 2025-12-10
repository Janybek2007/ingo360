import { flexRender } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';
import { TableTotalRow } from './table-total-row.ui';

const CHUNK_SIZE = 200;
const CHUNK_DELAY = 50;
const PROGRESSIVE_LOAD_THRESHOLD = 1000;

const TableLoadingOverlay = React.memo(
  ({ current, total }: Record<'current' | 'total', number>) => (
    <div className="absolute inset-0 bg-black/10 z-[100] flex items-center justify-center pointer-events-auto">
      <div className="bg-white rounded-lg px-6 py-4 shadow-xl flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-700 font-medium">
          Подгружаем строки… {current} / {total}
        </span>
      </div>
    </div>
  )
);

TableLoadingOverlay.displayName = '_TableLoadingOverlay_';

export function TableBody({
  table,
  highlightRow,
  pinnedRow,
  rowTotal,
  rowVirtualizer,
  isVirtualized = true,
  setOverflow,
}: ITableBodyProps) {
  const rows = table.getRowModel().rows;

  const initialCount = useMemo(
    () => (rows.length > PROGRESSIVE_LOAD_THRESHOLD ? CHUNK_SIZE : rows.length),
    [rows.length]
  );

  const [visibleRowCount, setVisibleRowCount] = useState(initialCount);

  useEffect(() => {
    if (rows.length <= PROGRESSIVE_LOAD_THRESHOLD) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleRowCount(rows.length);
      return;
    }

    setVisibleRowCount(prev => Math.min(prev || CHUNK_SIZE, rows.length));

    if (visibleRowCount >= rows.length) return;

    const timer = setTimeout(() => {
      setVisibleRowCount(prev => Math.min(prev + CHUNK_SIZE, rows.length));
    }, CHUNK_DELAY);

    return () => clearTimeout(timer);
  }, [rows.length, visibleRowCount]);

  const displayRows = useMemo(
    () => rows.slice(0, visibleRowCount),
    [rows, visibleRowCount]
  );

  const isLoading =
    rows.length > PROGRESSIVE_LOAD_THRESHOLD && visibleRowCount < rows.length;

  React.useEffect(() => {
    setOverflow?.(isLoading ? 'hidden' : 'auto');
  }, [isLoading, setOverflow]);

  if (!isVirtualized || !rowVirtualizer) {
    return (
      <>
        <tbody>
          {displayRows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 group">
              {row.getVisibleCells().map(cell => {
                const columnDef = cell.column.columnDef;
                const accessor = columnDef.accessorKey;
                const isPinned = pinnedRow?.(row.original);

                return (
                  <td
                    key={cell.id}
                    style={{
                      ...(accessor !== 'actions' &&
                        !isPinned &&
                        getCommonPinningStyles(cell.column)),
                      minWidth: `${cell.column.getSize()}px`,
                      maxWidth: `${cell.column.getSize()}px`,
                    }}
                    className={cn(
                      cell.column.getIsPinned() &&
                        'bg-white group-hover:bg-gray-50',
                      'py-[0.875rem] border-r px-4 text-gray-800 whitespace-nowrap border-[#E4E4E4]',
                      'overflow-hidden text-ellipsis border-b',
                      isPinned ? 'sticky top-[45px] bottom-0 z-30' : '',
                      columnDef.pinned === 'right' && 'border-l',
                      highlightRow?.(row.original)
                    )}
                  >
                    {flexRender(columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}

          {rowTotal && <TableTotalRow table={table} rowTotal={rowTotal} />}
        </tbody>

        {isLoading && (
          <TableLoadingOverlay current={visibleRowCount} total={rows.length} />
        )}
      </>
    );
  }

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1].end ?? 0)
      : 0;

  return (
    <>
      <tbody>
        {paddingTop > 0 && (
          <tr>
            <td style={{ height: `${paddingTop}px` }} />
          </tr>
        )}

        {virtualRows.map(virtualRow => {
          const row = rows[virtualRow.index];

          if (!row) return null;

          return (
            <tr
              key={row.id}
              className={cn(
                'hover:bg-gray-50 group',
                highlightRow?.(row.original)
              )}
            >
              {row.getVisibleCells().map(cell => {
                const columnDef = cell.column.columnDef;
                const accessor = columnDef.accessorKey;

                return (
                  <td
                    key={cell.id}
                    style={{
                      ...(accessor !== 'actions' &&
                        getCommonPinningStyles(cell.column)),
                      minWidth: `${cell.column.getSize()}px`,
                      maxWidth: `${cell.column.getSize()}px`,
                    }}
                    className={cn(
                      cell.column.getIsPinned() &&
                        'bg-white group-hover:bg-gray-50',
                      'py-[0.875rem] border-r px-4 text-gray-800 whitespace-nowrap border-[#E4E4E4]',
                      'overflow-hidden text-ellipsis border-b',
                      columnDef.pinned == 'right' && 'border-l',
                      highlightRow?.(row.original)
                    )}
                  >
                    {flexRender(columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}

        {paddingBottom > 0 && (
          <tr>
            <td style={{ height: `${paddingBottom}px` }} />
          </tr>
        )}

        {rowTotal && <TableTotalRow table={table} rowTotal={rowTotal} />}
      </tbody>
      {isLoading && (
        <TableLoadingOverlay current={visibleRowCount} total={rows.length} />
      )}
    </>
  );
}
