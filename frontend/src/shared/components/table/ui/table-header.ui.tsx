import { flexRender } from '@tanstack/react-table';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useAnchorPosition } from '#/shared/hooks/use-anchor-position';
import { cn } from '#/shared/utils/cn';

import { Icon } from '../../ui/icon';
import type { ITableHeaderProps } from '../table.types';
import { getCommonPinningStyles } from '../utils/get-pinning-style';
import { FilterPopup } from './filter-popup/filter-popup.ui';

export function TableHeader<T>({ table }: ITableHeaderProps<T>) {
  const [popupOpen, setPopupOpen] = useState<string | null>(null);
  const { position: popupPosition, updatePosition } = useAnchorPosition();

  return (
    <thead className={cn('sticky top-0 z-10')}>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id} className="bg-[#F9F9F9]">
          {headerGroup.headers.map(header => {
            const columnDef = header.column.columnDef;
            const canFilter = columnDef.enableColumnFilter;

            return (
              <th
                key={header.id}
                className={cn(
                  'py-4 pl-4 text-left font-medium whitespace-nowrap tracking-[0.1px] leading-5 relative',
                  'border-b border-[#E4E4E4] not-last:border-r bg-[#F9F9F9] group'
                )}
                style={{
                  ...getCommonPinningStyles(header.column),
                  maxWidth: header.column.getSize(),
                  minWidth: header.column.getSize(),
                }}
                onDoubleClick={() => header.column.resetSize()}
              >
                <button
                  type="button"
                  aria-label="Resize column"
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={cn(
                    'absolute right-0 top-0 h-full w-1 select-none touch-manipulation',
                    'group-hover:bg-red-500'
                  )}
                  style={{
                    padding: 0,
                    background: 'transparent',
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
                      <Icon name="lucide:filter" size={16} />
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
