import { useMutation } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type {
  ExportToExcelButtonProps,
  ExportToExcelUrl,
} from './export-excel.types';

export type ExportExcelPayload = Pick<
  ExportToExcelButtonProps<any>,
  'fileName' | 'headerMap' | 'fieldsMap' | 'booleanMap' | 'customMap'
>;

const buildFileName = (name?: string) => `${name || 'export'}.xlsx`;

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const useExportExcelMutation = (url: ExportToExcelUrl) => {
  return useMutation({
    mutationKey: ['export-to-excel', url],
    mutationFn: async (payload: ExportExcelPayload) => {
      const response = await http.post(`${url.slice(1)}/export-excel`, {
        json: {
          file_name: payload.fileName || 'export',
          header_map: payload.headerMap,
          fields_map: payload.fieldsMap || {},
          boolean_map: payload.booleanMap || {},
          custom_map: payload.customMap || {},
        },
      });

      const blob = await response.blob();
      downloadBlob(blob, buildFileName(payload.fileName));
      return true;
    },
  });
};
