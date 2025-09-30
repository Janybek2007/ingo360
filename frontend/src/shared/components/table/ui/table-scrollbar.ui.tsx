import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ITableScrollbarProps } from '../table.types';

export const TableScrollbar = React.memo(
  ({
    thumbWidth,
    thumbPosition,
    onMouseDown,
    scrollbarRef,
    isDragging,
  }: ITableScrollbarProps) => (
    <div className="mt-2">
      <div
        ref={scrollbarRef}
        className={cn(
          'relative rounded-full cursor-pointer',
          'h-[20px] border border-[#E4E4E4] bg-white',
          isDragging && 'cursor-grabbing'
        )}
        onMouseDown={onMouseDown}
        role="scrollbar"
        tabIndex={0}
        aria-label="Table horizontal scrollbar"
        aria-controls="custom-table"
        aria-valuenow={thumbPosition}
      >
        <div
          className="absolute bg-[#D3DCF9] rounded-full"
          style={{
            width: `${thumbWidth - 12}px`,
            height: `calc(100% - 12px)`,
            transform: `translateX(${thumbPosition + 6}px)`,
            top: '6px',
          }}
        />
      </div>
    </div>
  )
);

TableScrollbar.displayName = '_TableScrollbar_';
