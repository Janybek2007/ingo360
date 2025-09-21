import React from 'react';
import * as XLSX from 'xlsx';

import { cn } from '#/shared/utils/cn';

import type { ExportToExcelProps } from './export-to-excel.types';

export const ExportToExcel = React.memo(
  <T extends object>({
    data,
    fileName = 'export.xlsx',
  }: ExportToExcelProps<T>) => {
    const handleExport = () => {
      if (!data || data.length === 0) {
        console.warn('Нет данных для экспорта');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, fileName);
    };

    return (
      <button
        onClick={handleExport}
        className={cn(
          'border border-[#94A3B8] rounded-lg gap-2 px-4 py-2',
          'text-left text-nowrap',
          'flex items-center justify-center cursor-pointer bg-white'
        )}
      >
        <span className={cn('text-black text-sm font-medium leading-[150%]')}>
          Выгрузить в Excel
        </span>
      </button>
    );
  }
);

ExportToExcel.displayName = '_ExportToExcel_';
