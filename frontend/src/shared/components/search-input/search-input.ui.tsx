import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { cn } from '#/shared/utils/cn';

import { Icon } from '../ui/icon';
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
          'px-3 py-2 rounded-lg border border-[#94A3B8] gap-3',
          'flex items-center justify-start',
          'bg-white'
        )}
      >
        <Icon name="lucide:search" className="size-[1.25rem]" color="#94A3B8" />
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
