import { flexRender } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps as ITableBodyProperties } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';
import { TableTotalRow } from './table-total-row.ui';

const CHUNK_SIZE = 200;
const CHUNK_DELAY = 50;
const PROGRESSIVE_LOAD_THRESHOLD = 1000;

export function TableBody({
  table,
  highlightRow,
  pinnedRow,
  rowTotal,
  rowVirtualizer,
  isVirtualized = true,
}: Readonly<ITableBodyProperties>) {
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

    setVisibleRowCount(previous =>
      Math.min(previous || CHUNK_SIZE, rows.length)
    );

    if (visibleRowCount >= rows.length) return;

    const timer = setTimeout(() => {
      setVisibleRowCount(previous =>
        Math.min(previous + CHUNK_SIZE, rows.length)
      );
    }, CHUNK_DELAY);

    return () => clearTimeout(timer);
  }, [rows.length, visibleRowCount]);

  const displayRows = useMemo(
    () => rows.slice(0, visibleRowCount),
    [rows, visibleRowCount]
  );

  if (!isVirtualized || !rowVirtualizer) {
    return (
      <>
        <tbody>
          {displayRows.map(row => (
            <tr key={row.id} className="group hover:bg-gray-50">
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
                      'border-r border-[#E4E4E4] px-4 py-[0.875rem] whitespace-nowrap text-gray-800',
                      'overflow-hidden border-b text-ellipsis',
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
      </>
    );
  }

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows.at(-1)?.end ?? 0) : 0;

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
                'group hover:bg-gray-50',
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
                      'border-r border-[#E4E4E4] px-4 py-[0.875rem] whitespace-nowrap text-gray-800',
                      'overflow-hidden border-b text-ellipsis',
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
    </>
  );
}
