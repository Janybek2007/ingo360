import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { cn } from '#/shared/utils/cn';

import { LucideSearchIcon } from '../../assets/icons';
import type { ISearchInputProps } from './search-input.types';

export const SearchInput: React.FC<ISearchInputProps> = React.memo(
  ({ saveValue, debouncTime = 300 }) => {
    const [value, setValue] = useState('');
    const [debouncedValue] = useDebounce(value, debouncTime);

    useEffect(() => {
      saveValue(debouncedValue);
    }, [debouncedValue, saveValue]);

    return (
      <div
        className={cn(
          'border border-gray-300 rounded-lg gap-2 px-3 py-2',
          'bg-white hover:border-gray-400',
          'flex items-center justify-start transition-colors'
        )}
      >
        <LucideSearchIcon
          style={{ color: 'rgb(148, 163, 184)' }}
          className="size-[1.15rem]"
        />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Поиск..."
          className={cn(
            'placeholder:text-[##94A3B8] font-inter text-base font-normal leading-[150%]',
            'outline-none'
          )}
        />
      </div>
    );
  }
);

SearchInput.displayName = '_SearchInput_';
