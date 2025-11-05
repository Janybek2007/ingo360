import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ICheckboxProps } from './checkbox.types';

const Checkbox: React.FC<ICheckboxProps> = React.memo(
  ({ classNames, checked, onChecked }) => {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      <label
        className={cn(
          'inline-flex items-center justify-center min-w-[1.115rem] max-w-[1.115rem] min-h-[1.115rem] max-h-[1.115rem] rounded-md border border-gray-300 cursor-pointer select-none',
          'transition-all duration-200',
          checked ? 'bg-blue-500 border-blue-500' : 'bg-white',
          classNames?.root
        )}
        onClick={e => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={e => {
            e.stopPropagation();
            onChecked?.(e.target.checked);
          }}
          className="hidden"
        />
        {checked && (
          <svg
            className="min-w-[0.65rem] max-w-[0.65rem] min-h-[0.65rem] max-h-[0.65rem] text-white pointer-events-none"
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
      </label>
    );
  }
);

Checkbox.displayName = '_Checkbox_';

export { Checkbox };
