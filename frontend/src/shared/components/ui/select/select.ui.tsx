import { useCallback, useState } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { cn } from '#/shared/utils/cn';

import { Checkbox } from '../checkbox';
import type { ISelectItem, ISelectProps } from './select.types';

export function Select<ISM extends boolean = false, VT = string>({
  items,
  setValue,
  value,
  checkbox = false,
  triggerText,
  leftIcon,
  rightIcon,
  classNames,
}: ISelectProps<ISM, VT>) {
  const [open, setOpen] = useState(false);
  const contentRef = useClickAway<HTMLDivElement>(() => setOpen(false));

  const handleSelect = useCallback(
    (item: ISelectItem) => {
      if (checkbox && Array.isArray(value)) {
        const newValue = value.includes(item.value)
          ? value.filter(v => v !== item.value)
          : [...value, item.value];
        setValue(newValue as ISelectProps<ISM, VT>['value']);
      } else {
        setValue(item.value as ISelectProps<ISM, VT>['value']);
        setOpen(false);
      }
    },
    [checkbox, setValue, value]
  );

  const isSelected = useCallback(
    (item: ISelectItem) => {
      if (checkbox && Array.isArray(value)) {
        return value.includes(item.value);
      }
      return value === item.value;
    },
    [checkbox, value]
  );

  return (
    <div
      className={cn('relative font-inter', classNames?.root)}
      ref={contentRef}
    >
      <button
        className={cn(
          'border border-[#94A3B8] rounded-lg gap-2 px-4 py-2',
          'text-left bg-white',
          'flex items-center justify-center cursor-pointer',
          classNames?.trigger
        )}
        onClick={() => setOpen(!open)}
      >
        {typeof leftIcon == 'function' ? leftIcon(open) : leftIcon}
        <span className={cn('text-black text-sm font-medium leading-[150%]')}>
          {triggerText}
        </span>
        {typeof rightIcon == 'function' ? rightIcon(open) : rightIcon}
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-10 mt-2 w-full bg-white rounded-xl border border-[#E4E4E4] max-h-60 overflow-auto',
            'py-3 noscrollbar',
            classNames?.menu
          )}
        >
          {items.map(item => (
            <button
              key={item.value}
              className={cn(
                'flex items-center justify-between px-4 py-3 cursor-pointer text-left text-nowrap',
                'w-full hover:bg-blue-500/10 hover:text-blue-500 text-black',
                'text-base font-inter font-normal leading-full -tracking-[0.15px]',
                classNames?.menuItem
              )}
              onClick={() => handleSelect(item)}
            >
              <div className="flex items-center space-x-2">
                {checkbox && (
                  <Checkbox
                    checked={isSelected(item)}
                    onChecked={() => handleSelect(item)}
                  />
                )}
                <span>{item.label}</span>
              </div>
              {!checkbox && isSelected(item) && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Select.displayName = '_Select_';
