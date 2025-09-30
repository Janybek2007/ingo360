import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import type { ITableBodyProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';

export function TableBody<T>({
  table,
  highlightRow,
  pinnedRow,
}: ITableBodyProps<T>) {
  return (
    <tbody>
      {table.getRowModel().rows.map(row => {
        const isPinned = pinnedRow?.(row.original);

        return (
          <tr key={row.id} className={cn('hover:bg-gray-100 group')}>
            {row.getVisibleCells().map(cell => {
              const columnDef = cell.column.columnDef;
              const accessor = columnDef.accessorKey;

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
                      'bg-white group-hover:bg-gray-100',
                    'border-b border-[#E4E4E4] not-last:border-r',
                    'py-[14px] pl-4 text-gray-800 whitespace-nowrap',
                    isPinned ? 'sticky top-[50px] bottom-0 z-30' : '',
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
