import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import {
  AddCompanyContract,
  type TAddCompanyContract,
} from '../company.contract';
import type { TAddCompanyResponse } from '../company.types';

export const useAddCompanyMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['companies-add'],
    mutationFn: async (body: TAddCompanyContract) => {
      const parsedBody = AddCompanyContract.parse(body);
      const response = await http.post('companies', {
        json: parsedBody,
      });
      return response.json<TAddCompanyResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');
      queryClient.invalidateQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies,
      });
      onClose();
      toast.success('Ресурс успешно добавлен');
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
