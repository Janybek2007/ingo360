import type { SortDirection } from '@tanstack/react-table';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  const [pendingSort, setPendingSort] = useState<SortDirection | false>(
    column.getIsSorted() as SortDirection
  );

  const colType = column.columnDef.filterType ?? 'string';
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

  const [width, setWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const resizeReference = useRef<{ startX: number; startWidth: number } | null>(
    null
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizeReference.current = {
        startX: e.clientX,
        startWidth: width,
      };
    },
    [width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeReference.current) return;

      const deltaX = e.clientX - resizeReference.current.startX;
      const newWidth = Math.max(
        250,
        Math.min(600, resizeReference.current.startWidth + deltaX)
      );
      setWidth(newWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    resizeReference.current = null;
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const applySorting = useCallback(() => {
    const currentSort = column.getIsSorted() as SortDirection;

    if (!pendingSort) {
      if (currentSort) {
        column.clearSorting();
      }
      return;
    }

    if (pendingSort === currentSort) return;

    column.toggleSorting(pendingSort === 'desc');
  }, [column, pendingSort]);

  const applyFilterAndSorting = useCallback(() => {
    applySorting();
    applyFilter();
  }, [applyFilter, applySorting]);

  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      ref={contentRef}
      style={{ ...getPopupStyle(popupPosition), width: `${width}px` }}
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
        <FilterActions onClose={onClose} onApply={applyFilterAndSorting} />
      </div>

      {/* Left Resize Handle */}
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 h-full w-1 cursor-ew-resize bg-transparent transition-colors hover:bg-blue-500/20"
        aria-label="Изменить размер слева"
      />

      {/* Right Resize Handle */}
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-transparent transition-colors hover:bg-blue-500/20"
        aria-label="Изменить размер справа"
      />
    </div>
  );
}
