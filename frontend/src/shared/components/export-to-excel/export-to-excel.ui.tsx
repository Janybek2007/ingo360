import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ExportToExcelProps as ExportToExcelProperties } from './export-to-excel.types';
import { ExcelExporter } from './utils';

const ExportToExcelComponent = <T extends object>(
  properties: ExportToExcelProperties<T>
) => {
  const handleExport = React.useCallback(() => {
    const exporter = new ExcelExporter(properties);
    exporter.export();
  }, [properties]);

  return (
    <button
      onClick={handleExport}
      className={cn(
        'gap-2 rounded-lg border border-gray-300 px-3 py-2',
        'bg-white text-left hover:border-gray-400',
        'flex cursor-pointer items-center justify-center transition-colors'
      )}
    >
      <span
        className={cn(
          'leading-full max-w-full overflow-hidden text-nowrap text-ellipsis'
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
  properties: ExportToExcelProperties<T>
) => React.JSX.Element;

(
  ExportToExcel as React.MemoExoticComponent<typeof ExportToExcelComponent>
).displayName = '_ExportToExcel_';
