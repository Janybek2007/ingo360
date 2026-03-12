import { useMemo, useState } from 'react';

import { LucideFilterIcon } from '#/shared/assets/icons';
import { filterItems } from '#/shared/constants/filter-items';
import { getPopupStyle } from '#/shared/utils/get-popup-style';

import type { IFilterPopupProps as IFilterPopupProperties } from '../../table.types';
import { useFilterPopup } from '../../utils/use-filter-popup';
import { FilterActions } from './filter-actions.ui';
import { FilterInput } from './filter-input.ui';
import { FilterSelect } from './filter-select.ui';
import { SortButtons } from './sort-buttons.ui';

export function FilterPopup({
  column,
  onClose,
  popupPosition,
}: Readonly<IFilterPopupProperties>) {
  const colType = column.columnDef.filterType ?? 'string';
  const selectOptions = useMemo(
    () => column.columnDef.selectOptions ?? [],
    [column.columnDef.selectOptions]
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSelectOptions = useMemo(() => {
    if (!searchQuery.trim()) return selectOptions;
    const q = searchQuery.toLowerCase();
    return selectOptions.filter(item => item.label.toLowerCase().includes(q));
  }, [selectOptions, searchQuery]);

  const {
    contentRef,
    popupHeight,
    isPositioned,
    width,
    handleResizeMouseDown,
    pendingSort,
    setPendingSort,
    filterType,
    value,
    value2,
    setFilterType,
    setValue,
    setValue2,
    applyFilterAndSorting,
  } = useFilterPopup({
    column,
    onClose,
    selectOptions,
    colType,
    effectiveOptions: searchQuery.trim() ? filteredSelectOptions : undefined,
  });

  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      ref={contentRef}
      style={{
        ...getPopupStyle(popupPosition, popupHeight),
        width: `${width}px`,
        visibility: isPositioned ? 'visible' : 'hidden',
      }}
      className="font-inter absolute z-50 mt-1 rounded-sm border border-gray-300 bg-white p-0 shadow-xl select-none"
    >
      <div className="relative p-3">
        <SortButtons
          isSorted={pendingSort}
          toggleSorting={asc => setPendingSort(asc ? 'desc' : 'asc')}
          resetSorting={() => setPendingSort(false)}
        />

        {column.columnDef.enableColumnFilter && (
          <div className="mb-3">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <LucideFilterIcon className="size-[1rem]" />
              Фильтр
            </h4>

            {colType === 'select' ? (
              <FilterSelect
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
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

        <FilterActions onClose={onClose} onApply={applyFilterAndSorting} />
      </div>

      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 left-0 h-full w-1 cursor-ew-resize bg-transparent transition-colors hover:bg-blue-500/20"
        aria-label="Изменить размер слева"
      />
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-transparent transition-colors hover:bg-blue-500/20"
        aria-label="Изменить размер справа"
      />
    </div>
  );
}
