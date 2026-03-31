import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

import { LucideCheckIcon, LucidMinusIcon } from '../../../assets/icons';
import { Checkbox } from '../checkbox';
import type {
  ISelectItem,
  ISelectProps as ISelectProperties,
} from './select.types';

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
          'flex cursor-pointer items-center gap-2 px-3 py-2 text-left',
          'w-full transition-colors',
          'group justify-between font-normal',
          indeterminate
            ? 'hover:bg-blue-50'
            : 'hover:bg-blue-50 hover:text-blue-600',
          className
        )}
        onClick={onSelect}
        title={item.label}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {checkbox && !indeterminate && (
            <Checkbox checked={isSelected} onChecked={onSelect} />
          )}
          {indeterminate && (
            <LucidMinusIcon className="size-4 shrink-0 text-gray-700" />
          )}
          <span>{item.label}</span>
        </div>
        {!checkbox && isSelected && !indeterminate && (
          <LucideCheckIcon className="size-4 shrink-0 text-gray-700" />
        )}
      </button>
    );
  }
);

SelectItem.displayName = '_SelectItem_';

const SearchInput = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-2 py-2">
        <input
          type="text"
          placeholder="Поиск..."
          value={value}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
);

SearchInput.displayName = '_SearchInput_';

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
          'flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-blue-50 hover:text-blue-600',
          className
        )}
        onClick={onToggle}
      >
        <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {allSelected ? 'Сбросить все' : 'Выбрать все'}
        </span>
      </button>
    );
  }
);

ToggleAllButton.displayName = '_ToggleAllButton_';

// ─── Виртуализированный список ────────────────────────────────────────────────

function VirtualList<VT>({
  items,
  isSelected,
  onSelect,
  checkbox,
  indeterminate,
  className,
}: Readonly<{
  items: ISelectItem<VT>[];
  isSelected: (item: ISelectItem<VT>) => boolean;
  onSelect: (item: ISelectItem<VT>) => void;
  checkbox: boolean;
  indeterminate: boolean;
  className?: string;
}>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
    measureElement: navigator.userAgent.includes('Firefox')
      ? undefined
      : element => element.getBoundingClientRect().height,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="noscrollbar flex-1 overflow-auto py-1"
      style={{ maxHeight: '18rem' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map(virtualRow => {
          const item = items[virtualRow.index];
          return (
            <div
              key={`${item.value}-${item.label}`}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <SelectItem
                item={item}
                isSelected={isSelected(item)}
                onSelect={() => onSelect(item)}
                checkbox={checkbox}
                indeterminate={indeterminate}
                className={className}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Обычный список ───────────────────────────────────────────────────────────

function PlainList<VT>({
  items,
  isSelected,
  onSelect,
  checkbox,
  indeterminate,
  className,
  parentRef,
}: Readonly<{
  items: ISelectItem<VT>[];
  isSelected: (item: ISelectItem<VT>) => boolean;
  onSelect: (item: ISelectItem<VT>) => void;
  checkbox: boolean;
  indeterminate: boolean;
  className?: string;
  parentRef: React.RefObject<HTMLDivElement | null>;
}>) {
  return (
    <div
      ref={parentRef}
      className="noscrollbar flex-1 overflow-auto py-1"
      style={{ maxHeight: '18rem' }}
    >
      {items.map(item => (
        <SelectItem
          key={`${item.value}-${item.label}`}
          item={item}
          isSelected={isSelected(item)}
          onSelect={() => onSelect(item)}
          checkbox={checkbox}
          indeterminate={indeterminate}
          className={className}
        />
      ))}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

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
  isVirtualize = false,
}: Readonly<ISelectProperties<ISM, VT>>) {
  const [open, { toggle, set }] = useToggle();
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [align, setAlign] = useState<'left' | 'right'>('right');
  const contentReference = useClickAway<HTMLDivElement>(() => {
    set(false);
    setSearchQuery('');
  });
  const parentReference = useRef<HTMLDivElement>(null);
  const initialValueReference = useRef(value);

  useEffect(() => {
    if (!open || !contentReference.current) return;

    const triggerRect = contentReference.current.getBoundingClientRect();
    const menuHeight = 288; // max-h-72 in rem converted to px (18rem)
    const gap = 8; // mt-1 spacing

    // Determine vertical position
    const spaceBelow = window.innerHeight - triggerRect.bottom - gap;
    const spaceAbove = triggerRect.top - gap;

    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setPosition('top');
    } else {
      setPosition('bottom');
    }

    // Determine horizontal alignment
    const spaceRight = window.innerWidth - triggerRect.left;
    const spaceLeft = triggerRect.right;

    if (spaceRight < triggerRect.width && spaceLeft > triggerRect.width) {
      setAlign('left');
    } else {
      setAlign('right');
    }
  }, [open]);

  const uniqueItems = useMemo(() => {
    return getUniqueItems(items, ['value']);
  }, [items]);

  const effectiveValue = useMemo((): VT | VT[] | undefined => {
    if (!isMultiple || !defaultAllSelected) return value;

    // eslint-disable-next-line react-hooks/refs
    const isInitialRender = value === initialValueReference.current;
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

      const array = Array.isArray(effectiveValue) ? effectiveValue : [];
      return array.includes(item.value);
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

  const listContent = isVirtualize ? (
    <VirtualList
      items={filteredItems}
      isSelected={isSelected}
      onSelect={handleSelect}
      checkbox={checkbox}
      indeterminate={indeterminate}
      className={classNames?.menuItem}
    />
  ) : (
    <PlainList
      items={filteredItems}
      isSelected={isSelected}
      onSelect={handleSelect}
      checkbox={checkbox}
      indeterminate={indeterminate}
      className={classNames?.menuItem}
      parentRef={parentReference}
    />
  );

  return (
    <div className={cn('relative', classNames?.root)} ref={contentReference}>
      <button
        className={cn(
          'gap-2 rounded-lg border border-gray-300 px-3 py-2',
          'bg-white text-left hover:border-gray-400',
          'flex cursor-pointer items-center justify-center transition-colors',
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
              'leading-full flex-1 overflow-hidden text-ellipsis whitespace-nowrap',
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
            'absolute z-10 max-h-72 overflow-hidden rounded-xl bg-white',
            'border border-gray-200 shadow-xs',
            'flex flex-col',
            position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
            align === 'left' ? 'right-0' : 'left-0',
            classNames?.menu
          )}
        >
          {search && (
            <SearchInput value={searchQuery} onChange={handleSearchChange} />
          )}

          {filteredItems.length === 0 ? (
            <div className="px-3 py-2 text-center text-gray-500">
              Ничего не найдено
            </div>
          ) : (
            listContent
          )}

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
