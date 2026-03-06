import type { Column, ColumnDefBase } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';

interface IUseFilterPopupArgs {
  column: Column<any, unknown>;
  onClose: VoidFunction;
  selectOptions: {
    label: string;
    value: string | number;
  }[];
  colType: ColumnDefBase<any>['filterType'];
}

export const useFilterPopup = ({
  column,
  onClose,
  selectOptions,
  colType = 'string',
}: IUseFilterPopupArgs) => {
  const contentRef = useClickAway<HTMLDivElement>(onClose);

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
    if (colType === 'select') {
      if (!Array.isArray(value) || value.length === 0) {
        column.setFilterValue(undefined);
        onClose();
        return;
      }
      column.setFilterValue({
        selectValues: value,
        colType,
        header: column.columnDef.header,
      });
    } else if (colType === 'number' && filterType === 'between') {
      if (
        value === '' ||
        value === null ||
        value === undefined ||
        value2 === ''
      ) {
        column.setFilterValue(undefined);
        onClose();
        return;
      }
      column.setFilterValue({
        type: filterType,
        value: [value, value2],
        colType,
        header: column.columnDef.header,
      });
    } else {
      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        column.setFilterValue(undefined);
        onClose();
        return;
      }
      column.setFilterValue({
        type: filterType,
        value,
        colType,
        header: column.columnDef.header,
      });
    }
    onClose();
  }, [colType, filterType, onClose, value, column, value2]);

  return {
    contentRef,
    filterType,
    value,
    value2,
    setFilterType,
    setValue,
    setValue2,
    applyFilter,
  };
};
