import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';

export function TableBody({
  table,
  highlightRow,
  pinnedRow,
  rowTotal,
}: ITableBodyProps) {
  return (
    <tbody>
      {table.getRowModel().rows.map(row => {
        const isPinned = pinnedRow?.(row.original);
        const cells = row.getVisibleCells();

        return (
          <tr
            key={row.id}
            className={cn('hover:bg-gray-50 group border-b border-[#E4E4E4]')}
          >
            {row.getVisibleCells().map((cell, cellIndex) => {
              const columnDef = cell.column.columnDef;
              const accessor = columnDef.accessorKey;
              const isLastCell = cellIndex === cells.length - 1;

              return (
                <td
                  key={cell.id}
                  style={{
                    ...(!isPinned &&
                      accessor !== 'actions' &&
                      getCommonPinningStyles(cell.column)),
                    minWidth: cell.column.getSize(),
                  }}
                  className={cn(
                    !isPinned &&
                      cell.column.getIsPinned() &&
                      'bg-white group-hover:bg-gray-50',
                    !isLastCell && 'border-r',
                    'py-[0.875rem] px-4 text-gray-800 whitespace-nowrap border-[#E4E4E4]',
                    isPinned
                      ? 'sticky top-[3.125rem] bottom-0 z-30 border-t'
                      : '',
                    'overflow-hidden text-ellipsis border-b',
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

              if (accessor === 'total') {
                return (
                  <td
                    key={column.id}
                    style={{
                      ...getCommonPinningStyles(column),
                      maxWidth: column.columnDef.size,
                      minWidth: column.columnDef.size,
                    }}
                    className={cn(
                      'text-right py-[0.875rem] px-4 border-r border-t border-[#e4e4e4] bg-white',
                      'sticky bottom-0 z-[20]',
                      column.getIsPinned() && 'bg-white'
                    )}
                  >
                    {rowTotal.grandTotal?.toLocaleString('ru-RU') || 0}
                  </td>
                );
              }

              const monthMatch = columnId.match(/month(\d+)/);
              if (monthMatch && rowTotal.monthTotals) {
                const monthIndex = parseInt(monthMatch[1]) - 1;
                const total = rowTotal.monthTotals[monthIndex] || 0;

                return (
                  <td
                    key={column.id}
                    style={{
                      maxWidth: column.columnDef.size,
                      minWidth: column.columnDef.size,
                    }}
                    className="text-right py-[0.875rem] px-4 border-r border-t border-[#e4e4e4] bg-white  sticky bottom-0 z-[16]"
                  >
                    {total.toLocaleString('ru-RU')}
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
