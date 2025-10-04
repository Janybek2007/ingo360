import type { SortDirection } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Icon } from '#/shared/components/ui/icon';
import { useClickAway } from '#/shared/hooks/use-click-away';
import { cn } from '#/shared/utils/cn';
import { getPopupStyle } from '#/shared/utils/get-popup-style';

import type { IFilterPopupProps } from '../../table.types';
import { FilterActions } from './filter-actions.ui';
import { FilterInput } from './filter-input.ui';
import { FilterSelect } from './filter-select.ui';
import { SortButtons } from './sort-buttons.ui';

export function FilterPopup({
  column,
  onClose,
  popupPosition,
}: IFilterPopupProps) {
  const contentRef = useClickAway<HTMLDivElement>(onClose);

  const colType = column.columnDef.type ?? 'string';
  const selectOptions = useMemo(
    () => column.columnDef.selectOptions ?? [],
    [column.columnDef.selectOptions]
  );

  const initialFilterValue = column.getFilterValue();
  const initialFilterType = useMemo(() => {
    if (colType === 'select') return 'select';
    if (
      initialFilterValue &&
      typeof initialFilterValue === 'object' &&
      'type' in initialFilterValue
    ) {
      return initialFilterValue.type as string;
    }
    return colType === 'number' ? '=' : 'contains';
  }, [initialFilterValue, colType]);

  const initialValue = useMemo(() => {
    if (colType === 'select') {
      return initialFilterValue ?? selectOptions.map(v => v.value);
    }
    if (
      initialFilterValue &&
      typeof initialFilterValue === 'object' &&
      'value' in initialFilterValue
    ) {
      return Array.isArray(initialFilterValue.value)
        ? initialFilterValue.value[0]
        : initialFilterValue.value;
    }
    return '';
  }, [initialFilterValue, colType, selectOptions]);

  const initialValue2 = useMemo(() => {
    if (
      colType === 'number' &&
      initialFilterValue &&
      typeof initialFilterValue === 'object' &&
      'value' in initialFilterValue
    ) {
      return Array.isArray(initialFilterValue.value)
        ? (initialFilterValue.value[1] ?? '')
        : '';
    }
    return '';
  }, [initialFilterValue, colType]);

  const [filterType, setFilterType] = useState<string>(initialFilterType);
  const [value, setValue] = useState<string | number | (string | number)[]>(
    initialValue
  );
  const [value2, setValue2] = useState<string | number>(initialValue2);

  useEffect(() => {
    setFilterType(initialFilterType);
    setValue(initialValue);
    setValue2(initialValue2);
  }, [initialFilterType, initialValue, initialValue2]);

  const filterItems = useMemo(() => {
    if (colType === 'number') {
      return [
        { value: '>', label: 'Больше чем' },
        { value: '>=', label: 'Больше или равно' },
        { value: '<', label: 'Меньше чем' },
        { value: '<=', label: 'Меньше или равно' },
        { value: '=', label: 'Точно равно' },
        { value: 'between', label: 'Между' },
      ];
    } else if (colType === 'string') {
      return [
        { value: 'contains', label: 'Содержит' },
        { value: 'startsWith', label: 'Начинается с' },
        { value: 'equals', label: 'Точно равно' },
        { value: 'doesNotEqual', label: 'Не равно' },
      ];
    } else {
      return [];
    }
  }, [colType]);

  const applyFilter = useCallback(() => {
    if (colType === 'select') {
      column.setFilterValue(value);
    } else if (colType === 'number' && filterType === 'between') {
      column.setFilterValue({ type: filterType, value: [value, value2] });
    } else {
      column.setFilterValue({ type: filterType, value });
    }
    onClose();
  }, [column, colType, filterType, value, value2, onClose]);

  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      style={getPopupStyle(popupPosition)}
      ref={contentRef}
      className={cn(
        'absolute z-50 w-max max-w-[400px] bg-white border border-gray-200',
        'rounded-xl p-4 font-sans transition-all duration-200 mt-2',
        popupPosition.clickArea === 'top-left'
          ? 'ml-2'
          : popupPosition.clickArea === 'top-right' && 'mr-2'
      )}
    >
      <SortButtons
        isSorted={column.getIsSorted() as SortDirection}
        toggleSorting={v => column.toggleSorting(v)}
      />

      {/* Filter Section */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Icon name="lucide:filter" size={16} className="text-gray-500" />
          Фильтр
        </h4>

        {colType === 'select' ? (
          <FilterSelect
            value={Array.isArray(value) ? value : []}
            setValue={setValue}
            items={selectOptions}
          />
        ) : (
          <FilterInput
            filterType={filterType}
            setFilterType={setFilterType}
            filterItems={filterItems}
            colType={colType}
            value={Array.isArray(value) ? value[0] : value}
            setValue={setValue}
            value2={value2}
            setValue2={setValue2}
          />
        )}
      </div>

      {/* Actions */}
      <FilterActions
        reset={() => {
          column.setFilterValue(undefined);
          column.clearSorting();
          onClose();
        }}
        onClose={onClose}
        onApply={applyFilter}
      />
    </div>
  );
}
