import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';
import { TableTotalRow } from './table-total-row.ui';

export function TableBody({
  table,
  highlightRow,
  pinnedRow,
  rowTotal,
  rowVirtualizer,
}: ITableBodyProps) {
  const rows = table.getRowModel().rows;
  const virtualRows = rowVirtualizer?.getVirtualItems() || [];
  const totalSize = rowVirtualizer?.getTotalSize() || 0;

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} />
        </tr>
      )}
      {(rowVirtualizer ? virtualRows : rows.map((_, i) => ({ index: i }))).map(
        (virtualRow, i) => {
          const row = rows[virtualRow.index];
          if (!row) return null;
          const isPinned = pinnedRow?.(row.original);

          return (
            <tr
              key={`${row.id}|${row.depth}|${row.getVisibleCells().length}|${i}`}
              className={cn('hover:bg-gray-50 group')}
            >
              {row.getVisibleCells().map((cell, index) => {
                const columnDef = cell.column.columnDef;
                const accessor = columnDef.accessorKey;

                return (
                  <td
                    key={`${cell.id}|${String(cell.column.columnDef.accessorKey)}|${index}`}
                    style={{
                      ...(!isPinned &&
                        accessor !== 'actions' &&
                        getCommonPinningStyles(cell.column)),
                      minWidth: `${cell.column.getSize()}px`,
                      maxWidth: `${cell.column.getSize()}px`,
                    }}
                    className={cn(
                      !isPinned &&
                        cell.column.getIsPinned() &&
                        'bg-white group-hover:bg-gray-50',
                      'py-[0.875rem] border-r px-4 text-gray-800 whitespace-nowrap border-[#E4E4E4]',
                      isPinned &&
                        'sticky top-[3.125rem] bottom-0 z-[100] border-t',
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
        }
      )}
      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} />
        </tr>
      )}
      {rowTotal && <TableTotalRow table={table} rowTotal={rowTotal} />}
    </tbody>
  );
}
