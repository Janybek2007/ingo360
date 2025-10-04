import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';

export function TableBody({ table, highlightRow, pinnedRow }: ITableBodyProps) {
  const rows = table.getRowModel().rows;
  return (
    <tbody>
      {table.getRowModel().rows.map((row, rowIndex) => {
        const isPinned = pinnedRow?.(row.original);
        const isLastRow = rowIndex === rows.length - 1;
        const cells = row.getVisibleCells();

        return (
          <tr key={row.id} className={cn('hover:bg-gray-50 group')}>
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
                    maxWidth: cell.column.getSize(),
                    minWidth: cell.column.getSize(),
                  }}
                  className={cn(
                    !isPinned &&
                      cell.column.getIsPinned() &&
                      'bg-white group-hover:bg-gray-50',
                    !isLastRow && 'border-b',
                    !isLastCell && 'border-r',
                    'py-[14px] pl-4 text-gray-800 whitespace-nowrap border-[#E4E4E4]',
                    isPinned ? 'sticky top-[50px] bottom-0 z-30' : '',
                    'overflow-hidden text-ellipsis w-full',
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
    </tbody>
  );
}
