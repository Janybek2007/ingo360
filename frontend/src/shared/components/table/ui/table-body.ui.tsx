import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import type { TableBodyProps } from '../table.types';

export function TableBody<T>({ table, highlightRow }: TableBodyProps<T>) {
  return (
    <tbody>
      {table.getRowModel().rows.map(row => (
        <tr
          key={row.id}
          className={cn(
            'border-b border-[#E4E4E4] hover:bg-gray-100',
            highlightRow?.(row.original)
          )}
        >
          {row.getVisibleCells().map(cell => (
            <td
              key={cell.id}
              className="py-[14px] pl-4 text-gray-800 whitespace-nowrap"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
