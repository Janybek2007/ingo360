import type { SortDirection } from '@tanstack/react-table';
import { useMemo } from 'react';

import { LucideFilterIcon } from '#/shared/components/icons';
import { filterItems } from '#/shared/constants/filter-items';
import { getPopupStyle } from '#/shared/utils/get-popup-style';

import type { IFilterPopupProps } from '../../table.types';
import { useFilterPopup } from '../../utils/use-filter-popup';
import { FilterActions } from './filter-actions.ui';
import { FilterInput } from './filter-input.ui';
import { FilterSelect } from './filter-select.ui';
import { SortButtons } from './sort-buttons.ui';

export function FilterPopup({
  column,
  onClose,
  popupPosition,
}: IFilterPopupProps) {
  const colType = column.columnDef.type ?? 'string';
  const selectOptions = useMemo(
    () => column.columnDef.selectOptions ?? [],
    [column.columnDef.selectOptions]
  );

  const {
    contentRef,
    filterType,
    value,
    value2,
    setFilterType,
    setValue,
    setValue2,
    applyFilter,
  } = useFilterPopup({ column, onClose, selectOptions, colType });
  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      ref={contentRef}
      style={getPopupStyle(popupPosition)}
      className="absolute z-50 font-inter bg-white border border-gray-300 rounded-sm shadow-xl p-0 mt-1 w-[300px]"
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
