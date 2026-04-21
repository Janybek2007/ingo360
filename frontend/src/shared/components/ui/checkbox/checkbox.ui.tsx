import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ICheckboxProps as ICheckboxProperties } from './checkbox.types';

const Checkbox: React.FC<ICheckboxProperties> = React.memo(
  ({ classNames, checked, onChecked }) => {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      <label
        className={cn(
          'inline-flex max-h-[1.115rem] min-h-[1.115rem] max-w-[1.115rem] min-w-[1.115rem] cursor-pointer items-center justify-center rounded-md border border-gray-300 select-none',
          'transition-all duration-200',
          checked ? 'border-blue-500 bg-blue-500' : 'bg-white',
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
            className="pointer-events-none max-h-[0.65rem] min-h-[0.65rem] max-w-[0.65rem] min-w-[0.65rem] text-white"
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
