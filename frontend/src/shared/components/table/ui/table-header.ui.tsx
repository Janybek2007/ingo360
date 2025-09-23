import { flexRender } from '@tanstack/react-table';

import { cn } from '#/shared/utils/cn';

import { Icon } from '../../ui/icon';
import type { TableHeaderProps } from '../table.types';

export function TableHeader<T>({ table }: TableHeaderProps<T>) {
  return (
    <thead
      className={cn(
        'sticky top-0 z-10 border-b border-[#E4E4E4]',
        'bg-[#F9F9F9]'
      )}
    >
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            const isSorted = header.column.getIsSorted();
            const canSort = header.column.columnDef.enableSorting;
            return (
              <th
                key={header.id}
                className={cn(
                  'py-4 pl-4 text-left font-medium whitespace-nowrap tracking-[0.1px] leading-5',
                  canSort && 'cursor-pointer select-none hover:text-gray-700'
                )}
                style={{
                  maxWidth: header.column.columnDef.size,
                  minWidth: header.column.columnDef.size,
                }}
                onClick={
                  canSort ? header.column.getToggleSortingHandler() : undefined
                }
              >
                <div className="flex items-center gap-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {canSort && (
                    <Icon
                      name={
                        isSorted === 'asc'
                          ? 'lucide:chevron-up'
                          : isSorted === 'desc'
                            ? 'lucide:chevron-down'
                            : 'lucide:chevrons-up-down'
                      }
                      className={cn(
                        'transition-transform duration-200 text-gray-400',
                        isSorted && 'text-gray-700'
                      )}
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
