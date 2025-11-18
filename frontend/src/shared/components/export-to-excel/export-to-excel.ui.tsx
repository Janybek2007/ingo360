import React from 'react';
import * as XLSX from 'xlsx';

import { cn } from '#/shared/utils/cn';

import type { ExportFormat, ExportToExcelProps } from './export-to-excel.types';
import {
  flattenPeriodData,
  getNestedValue,
  hasPeriods,
  setNestedValue,
} from './utils';

const ExportToExcelComponent = <T extends object>({
  data,
  fileName = 'export.xlsx',
  formatHeader,
  selectKeys = [],
  periodKey,
  periodAsPercent = false,
  transform,
}: ExportToExcelProps<T>) => {
  const handleExport = React.useCallback(() => {
    if (!data || data.length === 0) {
      console.warn('Нет данных для экспорта');
      return;
    }

    let formattedData = transform ? data.map(transform) : data;
    let periodKeys: string[] = [];

    if (periodKey && hasPeriods(formattedData)) {
      const result = flattenPeriodData(
        formattedData,
        periodKey,
        periodAsPercent
      );
      formattedData = result.formattedData;
      periodKeys = result.periodKeys;
    }

    formattedData = formattedData.map(item => {
      const newItem: any = {};

      const keysToExport =
        selectKeys.length > 0
          ? [...selectKeys, ...periodKeys]
          : [...(Object.keys(item) as (keyof T)[]), ...periodKeys];

      const filteredKeys = keysToExport.filter(
        key => !String(key).startsWith('period_')
      );

      filteredKeys.forEach(key => {
        const keyStr = String(key);
        let value = periodKeys.includes(keyStr)
          ? (getNestedValue(item, keyStr) ?? item[keyStr as keyof T])
          : getNestedValue(item, keyStr);

        value = value === undefined || value === null ? '-' : value;

        const newKey =
          formatHeader?.[keyStr as keyof ExportFormat<T>] || keyStr;
        setNestedValue(newItem, newKey, value);
      });

      return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  }, [
    data,
    fileName,
    formatHeader,
    selectKeys,
    periodKey,
    periodAsPercent,
    transform,
  ]);

  return (
    <button
      onClick={handleExport}
      className={cn(
        'border border-gray-300 rounded-lg gap-2 px-3 py-2',
        'text-left bg-white hover:border-gray-400',
        'flex items-center justify-center cursor-pointer transition-colors'
      )}
    >
      <span
        className={cn(
          'text-nowrap overflow-hidden text-ellipsis max-w-full leading-full'
        )}
      >
        Выгрузить в Excel
      </span>
    </button>
  );
};

export const ExportToExcel = React.memo(ExportToExcelComponent) as <
  T extends object,
>(
  props: ExportToExcelProps<T>
) => React.JSX.Element;

(
  ExportToExcel as React.MemoExoticComponent<typeof ExportToExcelComponent>
).displayName = '_ExportToExcel_';
