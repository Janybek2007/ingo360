import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ExportToExcelProps } from './export-to-excel.types';
import { ExcelExporter } from './utils';

const ExportToExcelComponent = <T extends object>(
  props: ExportToExcelProps<T>
) => {
  const handleExport = React.useCallback(() => {
    const exporter = new ExcelExporter(props);
    exporter.export();
  }, [props]);

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
