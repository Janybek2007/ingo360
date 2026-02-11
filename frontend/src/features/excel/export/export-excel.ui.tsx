import React from 'react';

import { cn } from '#/shared/utils/cn';

import { useExportExcelMutation } from './export-excel.mutation';
import type { ExportToExcelButtonProps } from './export-excel.types';

const ExportToExcelComponent = <T extends object>(
  props: ExportToExcelButtonProps<T>
) => {
  const {
    url,
    fileName,
    headerMap,
    fieldsMap,
    booleanMap,
    customMap,
    isPeriod = false,
  } = props;
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
        {isPending ? 'Выгрузка...' : 'Выгрузить в Excel'}
      </span>
    </button>
  );
};

export const ExportToExcelButton = React.memo(ExportToExcelComponent) as <
  T extends object,
>(
  props: ExportToExcelButtonProps<T>
) => React.JSX.Element;
(
  ExportToExcelButton as React.MemoExoticComponent<
    typeof ExportToExcelComponent
  >
).displayName = '_ExportToExcelButton_';
