import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

import { LucideCheckIcon, LucidMinusIcon } from '../../../assets/icons';
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
        {!checkbox && isSelected && !indeterminate && (
          <LucideCheckIcon className="size-4 text-gray-700 shrink-0" />
        )}
      </button>
    );
  }
);

SelectItem.displayName = 'SelectItem';

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
        <span className="overflow-hidden max-w-full whitespace-nowrap text-ellipsis">
          {allSelected ? 'Сбросить все' : 'Выбрать все'}
        </span>
      </button>
    );
  }
);

ToggleAllButton.displayName = '_ToggleAllButton_';

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
  defaultAllSelected = false,
}: ISelectProps<ISM, VT>) {
  const [open, { toggle, set }] = useToggle();
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useClickAway<HTMLDivElement>(() => {
    set(false);
    setSearchQuery('');
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef(value);

  const uniqueItems = useMemo(() => {
    return getUniqueItems(items, ['value']);
  }, [items]);

  const effectiveValue = useMemo(() => {
    if (!isMultiple || !defaultAllSelected) return value;
    // eslint-disable-next-line react-hooks/refs
    const isInitialRender = value === initialValueRef.current;
    if (!isInitialRender) return value;
    if (Array.isArray(value) && value.length > 0) return value;
    return uniqueItems.map(item => item.value);
  }, [value, isMultiple, defaultAllSelected, uniqueItems]);

  const filteredItems = useMemo(() => {
    if (!search || !searchQuery.trim()) return uniqueItems;

    const query = searchQuery.toLowerCase();
    return uniqueItems.filter(item => item.label.toLowerCase().includes(query));
  }, [uniqueItems, searchQuery, search]);

  const isSelected = useCallback(
    (item: ISelectItem<VT>) => {
      if (!isMultiple) return effectiveValue === item.value;

      const arr = Array.isArray(effectiveValue) ? effectiveValue : [];
      return arr.includes(item.value);
    },
    [effectiveValue, isMultiple]
  );

  const handleSelect = useCallback(
    (item: ISelectItem<VT>) => {
      if (!isMultiple) {
        setValue(item.value as any);
        set(false);
        return;
      }

      const current = Array.isArray(effectiveValue) ? effectiveValue : [];
      const newValue = current.includes(item.value)
        ? current.filter(v => v !== item.value)
        : [...current, item.value];

      setValue(newValue as any);
    },
    [isMultiple, effectiveValue, setValue, set]
  );

  const handleToggleAll = useCallback(() => {
    if (!isMultiple) return;

    const current = Array.isArray(effectiveValue) ? effectiveValue : [];

    const allSelectedNow =
      filteredItems.length > 0 &&
      filteredItems.every(item => current.includes(item.value));

    if (allSelectedNow) {
      setValue([] as any);
      return;
    }

    const newValues = filteredItems.map(item => item.value);
    setValue(newValues as any);
  }, [isMultiple, filteredItems, effectiveValue, setValue]);

  const findItemLabel = useMemo(() => {
    if (changeTriggerText && Array.isArray(effectiveValue)) {
      return uniqueItems
        .filter(item => effectiveValue.includes(item.value))
        .map(item => item.label)
        .join(', ');
    } else {
      const found = uniqueItems.find(v => v.value === effectiveValue);
      return found ? found.label : '';
    }
  }, [uniqueItems, effectiveValue, changeTriggerText]);

  const allSelected = useMemo(() => {
    if (!isMultiple) return false;
    return (
      filteredItems.length > 0 &&
      filteredItems.every(
        item =>
          Array.isArray(effectiveValue) && effectiveValue.includes(item.value)
      )
    );
  }, [filteredItems, effectiveValue, isMultiple]);

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

          <div
            ref={parentRef}
            className="overflow-auto noscrollbar flex-1 py-1"
            style={{ maxHeight: '18rem' }}
          >
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

          {showToggleAll && (
            <div className="shrink-0 border-t border-gray-300">
              <ToggleAllButton
                allSelected={allSelected}
                onToggle={handleToggleAll}
                className={classNames?.menuItem}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Select.displayName = '_Select_';
