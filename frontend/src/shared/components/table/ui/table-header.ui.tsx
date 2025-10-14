import { flexRender } from '@tanstack/react-table';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useAnchorPosition } from '#/shared/hooks/use-anchor-position';
import { cn } from '#/shared/utils/cn';

import { LucideFilterIcon } from '../../icons';
import type { ITableHeaderProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';
import { FilterPopup } from './filter-popup/filter-popup.ui';

export function TableHeader({ table }: ITableHeaderProps) {
  const [popupOpen, setPopupOpen] = useState<string | null>(null);
  const { position: popupPosition, updatePosition } = useAnchorPosition();

  return (
    <thead className={cn('sticky top-0 z-10')}>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            const columnDef = header.column.columnDef;
            const canFilter =
              columnDef.enableColumnFilter || columnDef.enableSorting;

            return (
              <th
                onDoubleClick={() => header.column.resetSize()}
                key={header.id}
                className={cn(
                  'py-4 pl-4 pr-10 text-left font-medium whitespace-nowrap tracking-[0.1px] leading-5 relative',
                  'border-b border-[#E4E4E4] not-last:border-r bg-gray-50 group'
                )}
                style={{
                  ...getCommonPinningStyles(header.column),
                  maxWidth: header.column.getSize(),
                }}
              >
                <button
                  type="button"
                  aria-label="Resize column"
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={cn(
                    'absolute right-0 top-0 h-full w-1.5 select-none touch-manipulation',
                    'bg-transparent hover:bg-blue-400/50 active:bg-blue-500 transition-colors'
                  )}
                  style={{
                    padding: 0,
                    border: 'none',
                    cursor: 'col-resize',
                  }}
                />
                <div className="flex items-center gap-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {canFilter && (
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={e => {
                        e.stopPropagation();
                        updatePosition(e);
                        setPopupOpen(
                          popupOpen === header.id ? null : header.id
                        );
                      }}
                    >
                      <LucideFilterIcon className="size-[1rem]" />
                    </button>
                  )}
                </div>

                {popupOpen === header.id &&
                  createPortal(
                    <FilterPopup
                      popupPosition={popupPosition}
                      column={header.column}
                      onClose={() => setPopupOpen(null)}
                    />,
                    document.body
                  )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

TableHeader.displayName = '_TableHeader_';
