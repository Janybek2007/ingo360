import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';

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
                        'sticky top-[3.125rem] bottom-0 z-30 border-t',
                      'overflow-hidden text-ellipsis border-b',
                      highlightRow?.(row.original)
                    )}
                  >
                    {}
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
      {rowTotal && (
        <tr className="sticky bottom-0 right-0 z-[16]">
          <td
            colSpan={rowTotal.firstColSpan}
            className="py-[0.875rem] sticky bottom-0 left-0 z-[18] border-t text-center border-r border-[#E4E4E4] bg-white"
          >
            Итого
          </td>
          {table
            .getVisibleLeafColumns()
            .slice(rowTotal.firstColSpan)
            .map(column => {
              const columnDef = column.columnDef;
              const accessor = columnDef.accessorKey as string;
              const columnId = column.id;

              if (accessor === 'total' || columnId === 'total') {
                const total = rowTotal.grandTotal ?? 0;
                return (
                  <td
                    key={column.id}
                    style={{
                      ...getCommonPinningStyles(column),
                    }}
                    className={cn(
                      'text-right py-[0.875rem] px-4 border-r border-t border-[#e4e4e4] bg-white',
                      'sticky bottom-0 z-[20]',
                      column.getIsPinned() && 'bg-white',
                      total < 0 && 'text-red-600'
                    )}
                  >
                    {total.toLocaleString('ru-RU', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                );
              }

              const monthMatch = columnId.match(/month(\d+)/);
              if (monthMatch && rowTotal.monthTotals) {
                const monthIndex = parseInt(monthMatch[1]) - 1;
                const total = rowTotal.monthTotals[monthIndex] ?? 0;

                return (
                  <td
                    key={column.id}
                    style={{
                      maxWidth: column.columnDef.size,
                      minWidth: column.columnDef.size,
                    }}
                    className={cn(
                      'text-right py-[0.875rem] px-4 border-r border-t border-[#e4e4e4] bg-white sticky bottom-0 z-[16]',
                      total < 0 && 'text-red-600'
                    )}
                  >
                    {total.toLocaleString('ru-RU', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                );
              }

              return (
                <td
                  key={column.id}
                  className="text-right py-[0.875rem] px-4 border-r border-t border-[#e4e4e4] bg-white  sticky bottom-0 z-[16]"
                >
                  -
                </td>
              );
            })}
        </tr>
      )}
    </tbody>
  );
}
