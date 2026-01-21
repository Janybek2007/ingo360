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
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizeRef.current = {
        startX: e.clientX,
        startWidth: width,
      };
    },
    [width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;

      const deltaX = e.clientX - resizeRef.current.startX;
      const newWidth = Math.max(
        250,
        Math.min(600, resizeRef.current.startWidth + deltaX)
      );
      setWidth(newWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    resizeRef.current = null;
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

  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      ref={contentRef}
      style={{ ...getPopupStyle(popupPosition), width: `${width}px` }}
      className="absolute z-50 font-inter bg-white border border-gray-300 rounded-sm shadow-xl p-0 mt-1 select-none"
    >
      <div className="p-3 relative">
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

      {/* Left Resize Handle */}
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-blue-500/20 transition-colors"
        aria-label="Изменить размер слева"
      />

      {/* Right Resize Handle */}
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-blue-500/20 transition-colors"
        aria-label="Изменить размер справа"
      />
    </div>
  );
}
