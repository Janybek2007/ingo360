import { useMutation } from '@tanstack/react-query';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';

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
        json: { ...parsedBody, ims_name: parsedBody.ims_name?.trim() || null },
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
    onError: QueryOnError,
  });
};
