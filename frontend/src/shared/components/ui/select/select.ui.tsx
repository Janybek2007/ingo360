import { memo, useCallback, useMemo, useState } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

import { LucideCheckIcon, LucidMinusIcon } from '../../icons';
import { Checkbox } from '../checkbox';
import type { ISelectItem, ISelectProps } from './select.types';

const SelectItem = memo(
  <VT,>({
    item,
    isSelected,
    onSelect,
    checkbox,
    indeterminate,
    className,
  }: {
    item: ISelectItem<VT>;
    isSelected: boolean;
    onSelect: () => void;
    checkbox: boolean;
    indeterminate: boolean;
    className?: string;
  }) => {
    return (
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 px-3 py-2 cursor-pointer text-left',
          'w-full transition-colors',
          'font-normal group justify-between',
          indeterminate
            ? 'hover:bg-blue-50'
            : 'hover:bg-blue-50 hover:text-blue-600',
          className
        )}
        onClick={onSelect}
        title={item.label}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {checkbox && !indeterminate && (
            <Checkbox checked={isSelected} onChecked={onSelect} />
          )}
          {indeterminate && (
            <LucidMinusIcon className="size-4 text-gray-700 shrink-0" />
          )}
          <span>{item.label}</span>
        </div>
        {!checkbox && isSelected && (
          <LucideCheckIcon className="size-4 text-gray-700 shrink-0" />
        )}
      </button>
    );
  }
);

SelectItem.displayName = 'SelectItem';

// Мемоизированный компонент для поля поиска
const SearchInput = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="px-2 py-2 border-b sticky top-0 bg-white border-gray-200 z-10">
        <input
          type="text"
          placeholder="Поиск..."
          value={value}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Мемоизированный компонент кнопки "Выбрать все"
const ToggleAllButton = memo(
  ({
    allSelected,
    onToggle,
    className,
  }: {
    allSelected: boolean;
    onToggle: () => void;
    className?: string;
  }) => {
    return (
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-blue-50 hover:text-blue-600 transition-colors',
          className
        )}
        onClick={onToggle}
      >
        <Checkbox checked={allSelected} onChecked={onToggle} />
        <span className="overflow-hidden max-w-full whitespace-nowrap text-ellipsis">
          {allSelected ? 'Снять все' : 'Выбрать все'}
        </span>
      </button>
    );
  }
);

ToggleAllButton.displayName = 'ToggleAllButton';

export function Select<ISM extends boolean = false, VT = string>({
  items,
  setValue,
  value,
  checkbox = false,
  search = false,
  triggerText,
  leftIcon,
  rightIcon,
  classNames,
  changeTriggerText = false,
  isMultiple,
  labelTemplate = '{label}',
  showToggleAll = false,
  indeterminate = false,
  onReset,
  resetLabel = 'Сбросить все',
}: ISelectProps<ISM, VT>) {
  const [open, { toggle, set }] = useToggle();
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useClickAway<HTMLDivElement>(() => {
    set(false);
    setSearchQuery('');
  });

  const uniqueItems = useMemo(() => {
    return getUniqueItems(items, ['value']);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!search || !searchQuery.trim()) return uniqueItems;

    const query = searchQuery.toLowerCase();
    return uniqueItems.filter(item => item.label.toLowerCase().includes(query));
  }, [uniqueItems, searchQuery, search]);

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
    const allSelected = filteredItems.every(item => value.includes(item.value));

    setValue(allSelected ? [] : (filteredItems.map(item => item.value) as any));
  }, [isMultiple, filteredItems, value, setValue]);

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
    return (
      filteredItems.length > 0 &&
      filteredItems.every(item => value.includes(item.value))
    );
  }, [filteredItems, value, isMultiple]);

  const handleSearchChange = useCallback((newQuery: string) => {
    setSearchQuery(newQuery);
  }, []);

  const renderedLeftIcon = useMemo(
    () => (typeof leftIcon === 'function' ? leftIcon(open) : leftIcon),
    [leftIcon, open]
  );

  const renderedRightIcon = useMemo(
    () => (typeof rightIcon === 'function' ? rightIcon(open) : rightIcon),
    [rightIcon, open]
  );

  return (
    <div className={cn('relative', classNames?.root)} ref={contentRef}>
      <button
        className={cn(
          'border border-gray-300 rounded-lg gap-2 px-3 py-2',
          'text-left bg-white hover:border-gray-400',
          'flex items-center justify-center cursor-pointer transition-colors',
          'w-full min-w-0',
          classNames?.trigger
        )}
        type="button"
        onClick={toggle}
        title={findItemLabel || triggerText}
      >
        {renderedLeftIcon && (
          <span className="shrink-0">{renderedLeftIcon}</span>
        )}
        {(triggerText || findItemLabel) && (
          <span
            className={cn(
              'overflow-hidden text-ellipsis whitespace-nowrap flex-1 leading-full',
              classNames?.triggerText
            )}
          >
            {changeTriggerText
              ? labelTemplate?.replace('{label}', findItemLabel) || triggerText
              : triggerText}
          </span>
        )}
        {renderedRightIcon && (
          <span className="shrink-0">{renderedRightIcon}</span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-10 w-full bg-white rounded-xl overflow-hidden max-h-72',
            'border border-gray-200 shadow-xs',
            'top-full mt-1',
            'flex flex-col',
            classNames?.menu
          )}
        >
          {search && (
            <SearchInput value={searchQuery} onChange={handleSearchChange} />
          )}

          {showToggleAll && (
            <div className="shrink-0">
              <ToggleAllButton
                allSelected={allSelected}
                onToggle={handleToggleAll}
                className={classNames?.menuItem}
              />
            </div>
          )}

          <div className="overflow-auto flex-1 py-1">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-center text-gray-500">
                Ничего не найдено
              </div>
            ) : (
              filteredItems.map(item => (
                <SelectItem
                  key={`${item.value}-${item.label}`}
                  item={item}
                  isSelected={isSelected(item)}
                  onSelect={() => handleSelect(item)}
                  checkbox={checkbox}
                  indeterminate={indeterminate}
                  className={classNames?.menuItem}
                />
              ))
            )}
          </div>

          {onReset && (
            <div className="border-t border-gray-200">
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={event => {
                  event.stopPropagation();
                  onReset();
                }}
              >
                {resetLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Select.displayName = '_Select_';
