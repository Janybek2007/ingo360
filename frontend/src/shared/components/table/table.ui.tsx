import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useRef } from 'react';

import { useTableScrollbar } from '#/shared/hooks/use-table-scrollbar';
import { cn } from '#/shared/utils/cn';

import type { ITableProps } from './table.types';
import { TableBody } from './ui/table-body.ui';
import { TableHeader } from './ui/table-header.ui';
import { TableScrollbar } from './ui/table-scrollbar.ui';

export function Table<T extends object>({
  columns,
  data,
  className = '',
  maxHeight = 500,
  highlightRow,
  isScrollbar = false,
  rounded = 'lg',
}: ITableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const { thumbWidth, thumbPosition, onThumbMouseDown, isDragging } =
    useTableScrollbar(tableContainerRef, scrollbarRef, isScrollbar);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={tableContainerRef}
        className={cn(
          'overflow-auto bg-white noscrollbar border border-[#E4E4E4] font-inter',
          rounded == 'sm' && 'rounded-sm',
          rounded == 'md' && 'rounded-md',
          rounded == 'lg' && 'rounded-lg'
        )}
        style={{ maxHeight }}
      >
        <table id="custom-table" className="min-w-full noscrollbar text-sm">
          <TableHeader table={table} />
          <TableBody table={table} highlightRow={highlightRow} />
        </table>
      </div>

      {isScrollbar && (
        <TableScrollbar
          scrollbarRef={scrollbarRef}
          thumbWidth={thumbWidth}
          thumbPosition={thumbPosition}
          onMouseDown={onThumbMouseDown}
          isDragging={isDragging}
        />
      )}
    </div>
  );
}

Table.displayName = '_Table_';
