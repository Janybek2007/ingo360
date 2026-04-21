import React from 'react';

import { cn } from '#/shared/utils/cn';

import { useExportExcelMutation } from './export-excel.mutation';
import type { ExportToExcelButtonProps as ExportToExcelButtonProperties } from './export-excel.types';

const ExportToExcelComponent = <T extends object>(
  properties: ExportToExcelButtonProperties<T>
) => {
  const {
    url,
    fileName,
    headerMap,
    fieldsMap,
    booleanMap,
    customMap,
    isPeriod = false,
  } = properties;
  const { mutate, isPending } = useExportExcelMutation(url);

  const handleExport = React.useCallback(() => {
    if (!headerMap) return;

    mutate({
      fileName,
      headerMap: headerMap as Record<string, string>,
      fieldsMap,
      booleanMap,
      customMap,
      isPeriod,
    });
  }, [booleanMap, customMap, fieldsMap, fileName, headerMap, isPeriod, mutate]);

  return (
    <button
      onClick={handleExport}
      disabled={isPending}
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
        {isPending ? 'Выгрузка...' : 'Выгрузить в Excel'}
      </span>
    </button>
  );
};

export const ExportToExcelButton = React.memo(ExportToExcelComponent) as <
  T extends object,
>(
  properties: ExportToExcelButtonProperties<T>
) => React.JSX.Element;
(
  ExportToExcelButton as React.MemoExoticComponent<
    typeof ExportToExcelComponent
  >
).displayName = '_ExportToExcelButton_';
