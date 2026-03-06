import { useMutation } from '@tanstack/react-query';

import { http } from '#/shared/api';
import { toast } from '#/shared/libs/toast/toasts';

import type {
  ExportToExcelButtonProps as ExportToExcelButtonProperties,
  ExportToExcelUrl,
} from './export-excel.types';

type ExportExcelPayload = Pick<
  ExportToExcelButtonProperties<any>,
  | 'fileName'
  | 'headerMap'
  | 'fieldsMap'
  | 'booleanMap'
  | 'customMap'
  | 'isPeriod'
>;

export const useExportExcelMutation = (url: ExportToExcelUrl) => {
  return useMutation({
    mutationKey: ['export-to-excel', url],
    mutationFn: async (payload: ExportExcelPayload) => {
      const response = await http.post<{
        task_id: string;
      }>(`${url.slice(1)}/export-excel`, {
        json: {
          file_name: payload.fileName || 'export',
          header_map: payload.headerMap,
          fields_map: payload.fieldsMap || {},
          boolean_map: payload.booleanMap || {},
          custom_map: payload.customMap || {},
          is_period: payload.isPeriod || false,
        },
      });

      const data = await response.json();

      if (data.task_id) {
        toast({
          message: 'Файл в процессе формирования',
          description: 'Мы оповестим вас, когда файл будет готов.',
          duration: 6000,
        });
      }
      return response;
    },
  });
};
