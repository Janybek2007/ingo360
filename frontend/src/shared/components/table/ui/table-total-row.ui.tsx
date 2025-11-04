import { cn } from '#/shared/utils/cn';

import type { ITableTotalRowProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';

export function TableTotalRow({ table, rowTotal }: ITableTotalRowProps) {
  if (!rowTotal) return null;
  return (
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
                  column.getIsPinned() && 'border-l',
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

          const monthMatch = columnId.match(/period_(\d+)/);
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
              className="text-right py-[0.875rem] px-4 border-r border-t border-[#e4e4e4] bg-white sticky bottom-0 z-[16]"
            >
              -
            </td>
          );
        })}
    </tr>
  );
}
