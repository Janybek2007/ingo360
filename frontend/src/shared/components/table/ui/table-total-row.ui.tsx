import { cn } from '#/shared/utils/cn';

import type { ITableTotalRowProps as ITableTotalRowProperties } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';

export function TableTotalRow({
  table,
  rowTotal,
}: Readonly<ITableTotalRowProperties>) {
  if (!rowTotal) return null;
  return (
    <tr className="sticky right-0 bottom-0 z-[16]">
      <td
        colSpan={rowTotal.firstColSpan}
        className="sticky bottom-0 left-0 z-[18] border-t border-r border-[#E4E4E4] bg-white py-[0.875rem] text-center"
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
          const period = columnDef.period;

          if (accessor === 'total' || columnId === 'total') {
            const total = rowTotal.grandTotal ?? 0;
            return (
              <td
                key={column.id}
                style={getCommonPinningStyles(column, 20)}
                className={cn(
                  'border-t border-r border-[#e4e4e4] bg-white px-4 py-[0.875rem] text-right',
                  'bottom-0 border-l',
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

          if (period && rowTotal.monthTotals) {
            const monthIndex = period - 1;
            const total = rowTotal.monthTotals[monthIndex] ?? 0;

            return (
              <td
                key={column.id}
                style={{
                  maxWidth: column.columnDef.size,
                  minWidth: column.columnDef.size,
                }}
                className={cn(
                  'sticky bottom-0 z-[16] border-t border-r border-[#e4e4e4] bg-white px-4 py-[0.875rem] text-right',
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
              className="sticky bottom-0 z-[16] border-t border-r border-[#e4e4e4] bg-white px-4 py-[0.875rem] text-right"
            ></td>
          );
        })}
    </tr>
  );
}
