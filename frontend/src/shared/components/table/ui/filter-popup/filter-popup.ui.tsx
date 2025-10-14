/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SortDirection } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { LucideFilterIcon } from '#/shared/components/icons';
import { filterItems } from '#/shared/constants/filter-items';
import { useClickAway } from '#/shared/hooks/use-click-away';
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
      if (
        initialFilterValue &&
        typeof initialFilterValue === 'object' &&
        'selectValues' in initialFilterValue
      ) {
        return (initialFilterValue as any).selectValues;
      }
      return selectOptions;
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
  }, [colType, initialFilterValue, selectOptions]);

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
  const [value, setValue] = useState<any>(initialValue);
  const [value2, setValue2] = useState<string | number>(initialValue2);

  useEffect(() => {
    setFilterType(initialFilterType);
    setValue(initialValue);
    setValue2(initialValue2);
  }, [initialFilterType, initialValue, initialValue2]);

  const applyFilter = useCallback(() => {
    if (colType === 'select') {
      column.setFilterValue({
        selectValues: value,
        colType,
        header: column.columnDef.header,
      });
    } else if (colType === 'number' && filterType === 'between') {
      column.setFilterValue({
        type: filterType,
        value: [value, value2],
        colType,
        header: column.columnDef.header,
      });
    } else {
      column.setFilterValue({
        type: filterType,
        value,
        colType,
        header: column.columnDef.header,
      });
    }
    onClose();
  }, [colType, filterType, onClose, value, column, value2]);

  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      ref={contentRef}
      style={getPopupStyle(popupPosition)}
      className="absolute z-50 bg-white border border-gray-300 rounded-sm shadow-xl p-0 mt-1 w-[300px]"
    >
      <div className="p-3">
        <SortButtons
          isSorted={column.getIsSorted() as SortDirection}
          toggleSorting={column.toggleSorting}
          resetSorting={() => {
            column.clearSorting();
            onClose();
          }}
        />

        {column.columnDef.enableColumnFilter && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <LucideFilterIcon className="size-[1rem]" />
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
                filterItems={filterItems(colType)}
                colType={colType}
                value={Array.isArray(value) ? value[0] : value}
                setValue={setValue}
                value2={value2}
                setValue2={setValue2}
              />
            )}
          </div>
        )}

        {/* Actions */}
        <FilterActions onClose={onClose} onApply={applyFilter} />
      </div>
    </div>
  );
}
