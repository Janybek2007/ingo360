import React from 'react';
import * as XLSX from 'xlsx';

import { cn } from '#/shared/utils/cn';

import type { ExportToExcelProps } from './export-to-excel.types';

export const ExportToExcel = React.memo(
  <T extends object>({
    data,
    fileName = 'export.xlsx',
  }: ExportToExcelProps<T>) => {
    const handleExport = React.useCallback(() => {
      if (!data || data.length === 0) {
        console.warn('Нет данных для экспорта');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, fileName);
    }, [data, fileName]);

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
  }
);

ExportToExcel.displayName = '_ExportToExcel_';
