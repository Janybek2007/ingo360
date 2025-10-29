import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import {
  AccessCompanyContract,
  type TAccessCompanyContract,
} from './access-company.contract';

export const useAccessCompanyMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['companies-access'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TAccessCompanyContract;
    }) => {
      const parsedBody = AccessCompanyContract.parse(body);

      const response = await http.patch(`companies/${id}`, {
        json: parsedBody,
      });

      return response.json();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      onClose();

      queryClient.invalidateQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies,
      });

      setTimeout(() => {
        toast.success('Настройки доступа компании успешно обновлены');
      }, 300);
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
