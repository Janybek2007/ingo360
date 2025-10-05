import React, { useCallback } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { uiSet } from '#/shared/utils/ui-set';

import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
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
  changeTriggerText = false,
}: ISelectProps<ISM, VT>) {
  const [open, { toggle, set }] = useToggle();
  const contentRef = useClickAway<HTMLDivElement>(() => set(false));

  const uniqueItems = React.useMemo(() => {
    const map = new Map<VT, ISelectItem<VT>>();
    for (const item of items) {
      if (!map.has(item.value)) {
        map.set(item.value, item);
      }
    }
    return Array.from(map.values());
  }, [items]);

  const handleSelect = useCallback(
    (item: ISelectItem<VT>) => {
      if (checkbox && Array.isArray(value)) {
        const newValue = value.includes(item.value)
          ? value.filter(v => v !== item.value)
          : [...value, item.value];
        setValue(newValue as ISelectProps<ISM, VT>['value']);
      } else {
        setValue(item.value as ISelectProps<ISM, VT>['value']);
        set(false);
      }
    },
    [checkbox, setValue, set, value]
  );

  const findItemLabel = React.useMemo(() => {
    if (changeTriggerText && Array.isArray(value)) {
      return uniqueItems
        .filter(item => value.includes(item.value))
        .map(item => item.label)
        .join(', ');
    } else {
      const found = uniqueItems.find(v => v.value === value);
      return found ? found.label : '';
    }
  }, [uniqueItems, value, changeTriggerText]);

  const isSelected = useCallback(
    (item: ISelectItem<VT>) => {
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
        type="button"
        onClick={toggle}
        title={findItemLabel || triggerText}
      >
        {typeof leftIcon == 'function' ? leftIcon(open) : leftIcon}
        {(triggerText || findItemLabel) && (
          <span
            className={cn(
              'text-black text-sm font-medium leading-[150%] text-nowrap',
              'overflow-hidden text-ellipsis max-w-full',
              classNames?.triggerText
            )}
          >
            {changeTriggerText ? findItemLabel || triggerText : triggerText}
          </span>
        )}
        {typeof rightIcon == 'function' ? rightIcon(open) : rightIcon}
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-10 w-full bg-white rounded-xl max-h-60 overflow-auto',
            'py-3 noscrollbar border border-[#E4E4E4]',
            'top-full mt-2',
            classNames?.menu
          )}
        >
          {uniqueItems.map(item => (
            <button
              key={`${item.value}-${item.label}-key`}
              type="button"
              className={cn(
                'flex items-center justify-between px-4 py-3 cursor-pointer text-left text-nowrap',
                'w-full hover:bg-blue-500/10 hover:text-blue-500 text-black',
                'text-base font-inter font-normal leading-full -tracking-[0.15px] group',
                classNames?.menuItem
              )}
              onClick={() => handleSelect(item)}
              title={item.label}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <Icon
                    {...uiSet.icon(item.icon, {
                      className: 'text-[#94A3B8] group-hover:text-blue-500',
                    })}
                  />
                )}
                {checkbox && (
                  <Checkbox
                    checked={isSelected(item)}
                    onChecked={() => handleSelect(item)}
                  />
                )}
                <span className="overflow-hidden text-ellipsis max-w-full">
                  {item.label}
                </span>
              </div>
              {!checkbox && isSelected(item) && (
                <Icon name="lucide:check" size={16} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Select.displayName = '_Select_';
