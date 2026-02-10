import { useMutation } from '@tanstack/react-query';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';

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
      queryClient.invalidateQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies({}),
      });
      onClose();
      toast({
        message: 'Ресурс успешно добавлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
