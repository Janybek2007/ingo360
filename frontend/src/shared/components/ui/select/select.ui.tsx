import { useCallback, useMemo } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
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
  isMultiple,
  labelTemplate = '{label}',
  showToggleAll = false,
  indeterminate = false,
}: ISelectProps<ISM, VT>) {
  const [open, { toggle, set }] = useToggle();
  const contentRef = useClickAway<HTMLDivElement>(() => set(false));

  const uniqueItems = useMemo(() => {
    return getUniqueItems(items, ['value']);
  }, [items]);

  const isSelected = useCallback(
    (item: ISelectItem<VT>) => {
      if (isMultiple && Array.isArray(value)) return value.includes(item.value);
      return value === item.value;
    },
    [value, isMultiple]
  );

  const handleSelect = useCallback(
    (item: ISelectItem<VT>) => {
      if (isMultiple && Array.isArray(value)) {
        const newValue = value.includes(item.value)
          ? value.filter(v => v !== item.value)
          : [...value, item.value];
        setValue(newValue as ISelectProps<ISM, VT>['value']);
      } else {
        setValue(item.value as ISelectProps<ISM, VT>['value']);
        set(false);
      }
    },
    [setValue, set, value, isMultiple]
  );

  const handleToggleAll = useCallback(() => {
    if (!isMultiple || !Array.isArray(value)) return;
    const allSelected = uniqueItems.every(item => value.includes(item.value));
    console.log(uniqueItems.map(item => item.value));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(allSelected ? [] : (uniqueItems.map(item => item.value) as any));
  }, [isMultiple, uniqueItems, value, setValue]);

  const findItemLabel = useMemo(() => {
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

  const allSelected = useMemo(() => {
    if (!isMultiple || !Array.isArray(value)) return false;
    return uniqueItems.every(item => value.includes(item.value));
  }, [uniqueItems, value, isMultiple]);

  return (
    <div className={cn('relative', classNames?.root)} ref={contentRef}>
      <button
        className={cn(
          'border border-gray-300 rounded-lg gap-2 px-3 py-2',
          'text-left bg-white hover:border-gray-400',
          'flex items-center justify-center cursor-pointer transition-colors',
          classNames?.trigger
        )}
        type="button"
        onClick={toggle}
        title={findItemLabel || triggerText}
      >
        {typeof leftIcon === 'function' ? leftIcon(open) : leftIcon}
        {(triggerText || findItemLabel) && (
          <span
            className={cn(
              'text-nowrap overflow-hidden text-ellipsis max-w-full leading-full',
              classNames?.triggerText
            )}
          >
            {changeTriggerText
              ? labelTemplate?.replace('{label}', findItemLabel) || triggerText
              : triggerText}
          </span>
        )}
        {typeof rightIcon === 'function' ? rightIcon(open) : rightIcon}
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-10 w-full bg-white rounded-xl max-h-72 overflow-auto',
            'py-1 noscrollbar border border-gray-200 shadow-xs',
            'top-full mt-1',
            classNames?.menu
          )}
        >
          {showToggleAll && (
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-blue-50 hover:text-blue-600 transition-colors',
                classNames?.menuItem
              )}
              onClick={handleToggleAll}
            >
              <Checkbox checked={allSelected} onChecked={handleToggleAll} />
              <span className="overflow-hidden max-w-full">
                {allSelected ? 'Снять все' : 'Выбрать все'}
              </span>
            </button>
          )}

          {uniqueItems.map(item => (
            <button
              key={`${item.value}-${item.label}-key`}
              type="button"
              className={cn(
                'flex items-center gap-2 px-3 py-2 cursor-pointer text-left text-nowrap',
                'w-full transition-colors',
                'font-normal group justify-between',
                indeterminate
                  ? 'hover:bg-blue-50 '
                  : 'hover:bg-blue-50 hover:text-blue-600 ',
                classNames?.menuItem
              )}
              onClick={() => handleSelect(item)}
              title={item.label}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <Icon
                    {...uiSet.icon(item.icon, { className: 'text-gray-400' })}
                  />
                )}
                {checkbox && !indeterminate && (
                  <Checkbox
                    checked={isSelected(item)}
                    onChecked={() => handleSelect(item)}
                  />
                )}
                {indeterminate && (
                  <Icon name="lucide:minus" className="size-4 text-gray-700" />
                )}
                <span className="overflow-hidden text-ellipsis max-w-full">
                  {item.label}
                </span>
              </div>
              {!checkbox && isSelected(item) && (
                <Icon name="lucide:check" className="size-4 text-gray-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Select.displayName = '_Select_';
