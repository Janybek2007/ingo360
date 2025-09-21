import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ICheckboxProps } from './checkbox.types';

const Checkbox: React.FC<ICheckboxProps> = React.memo(
  ({ classNames, checked, onChecked }) => {
    return (
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChecked?.(!checked)}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChecked?.(!checked);
          }
        }}
        className={cn(
          'w-5 h-5 rounded-md border border-gray-300 flexCenter cursor-pointer select-none',
          'transition-all duration-200',
          checked ? 'bg-blue-500 border-blue-500' : 'bg-white',
          classNames?.root
        )}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    );
  }
);

Checkbox.displayName = '_Checkbox_';

export { Checkbox };
