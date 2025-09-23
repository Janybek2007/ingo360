import { flexRender } from '@tanstack/react-table';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useAnchorPosition } from '#/shared/hooks/use-anchor-position';
import { cn } from '#/shared/utils/cn';

import { Icon } from '../../ui/icon';
import type { TableHeaderProps } from '../table.types';
import { FilterPopup } from './filter-popup.ui';

export function TableHeader<T>({ table }: TableHeaderProps<T>) {
  const [popupOpen, setPopupOpen] = useState<string | null>(null);
  const { position: popupPosition, updatePosition } = useAnchorPosition();

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
            const canFilter = header.column.columnDef.enableColumnFilter;

            return (
              <th
                key={header.id}
                className={cn(
                  'py-4 pl-4 text-left font-medium whitespace-nowrap tracking-[0.1px] leading-5 relative'
                )}
                style={{
                  maxWidth: header.column.columnDef.size,
                  minWidth: header.column.columnDef.size,
                }}
              >
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
