import type {
  Column,
  ColumnDefBase,
  SortDirection,
} from '@tanstack/react-table';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';

const buildFilterValue = ({
  colType,
  filterType,
  value,
  value2,
  effectiveValue,
  selectOptions,
  header,
}: {
  colType: string;
  filterType: string;
  value: any;
  value2: string | number;
  effectiveValue?: any[];
  selectOptions: { label: string; value: string | number }[];
  header?: string | number | any;
}) => {
  if (colType === 'select') {
    const isAllSelected =
      !Array.isArray(effectiveValue) ||
      effectiveValue.length === 0 ||
      selectOptions.every(opt =>
        effectiveValue.some((v: any) => v.value === opt.value)
      );

    if (isAllSelected) {
      return;
    }
    return {
      selectValues: effectiveValue,
      colType,
      header,
    };
  }

  if (colType === 'number' && filterType === 'between') {
    if (value === '' || value == null || value2 === '') {
      return;
    }
    return {
      type: filterType,
      value: [value, value2],
      colType,
      header,
    };
  }

  if (
    value === '' ||
    value == null ||
    (typeof value === 'string' && !value.trim())
  ) {
    return;
  }

  return {
    type: filterType,
    value,
    colType,
    header,
  };
};

interface IUseFilterPopupArgs {
  column: Column<any, unknown>;
  onClose: VoidFunction;
  selectOptions: { label: string; value: string | number }[];
  colType: ColumnDefBase<any>['filterType'];
  effectiveOptions?: { label: string; value: string | number }[];
}

export const useFilterPopup = ({
  column,
  onClose,
  selectOptions,
  colType = 'string',
  effectiveOptions,
}: IUseFilterPopupArgs) => {
  const contentRef = useClickAway<HTMLDivElement>(onClose);

  const [popupHeight, setPopupHeight] = useState(0);
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setPopupHeight(el.offsetHeight);
    setIsPositioned(true);
  }, [colType, column.columnDef.enableColumnFilter, contentRef]);

  const [width, setWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizeRef.current = { startX: e.clientX, startWidth: width };
    },
    [width]
  );

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;
      const delta = e.clientX - resizeRef.current.startX;
      setWidth(
        Math.max(250, Math.min(600, resizeRef.current.startWidth + delta))
      );
    },
    [isResizing]
  );

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
    resizeRef.current = null;
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  const [pendingSort, setPendingSort] = useState<SortDirection | false>(
    column.getIsSorted() as SortDirection
  );

  const applySorting = useCallback(() => {
    const currentSort = column.getIsSorted() as SortDirection;
    if (!pendingSort) {
      if (currentSort) column.clearSorting();
      return;
    }
    if (pendingSort !== currentSort) {
      column.toggleSorting(pendingSort === 'desc');
    }
  }, [column, pendingSort]);

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

  const [filterType, setFilterType] = useState<string>(() => initialFilterType);
  const [value, setValue] = useState<any>(() => initialValue);
  const [value2, setValue2] = useState<string | number>(() => initialValue2);

  const applyFilter = useCallback(() => {
    const effectiveValue =
      colType === 'select' && effectiveOptions
        ? value.filter((v: any) =>
            effectiveOptions.some(opt => opt.value === v.value)
          )
        : value;

    const filterValue = buildFilterValue({
      colType,
      filterType,
      value,
      value2,
      effectiveValue,
      selectOptions,
      header: column.columnDef.header,
    });

    column.setFilterValue(filterValue);
    onClose();
  }, [
    colType,
    filterType,
    onClose,
    value,
    value2,
    column,
    selectOptions,
    effectiveOptions,
  ]);

  const applyFilterAndSorting = useCallback(() => {
    applySorting();
    applyFilter();
  }, [applySorting, applyFilter]);

  return {
    // refs & visibility
    contentRef,
    popupHeight,
    isPositioned,
    // resize
    width,
    handleResizeMouseDown,
    // sorting
    pendingSort,
    setPendingSort,
    // filter
    filterType,
    value,
    value2,
    setFilterType,
    setValue,
    setValue2,
    // actions
    applyFilterAndSorting,
  };
};
