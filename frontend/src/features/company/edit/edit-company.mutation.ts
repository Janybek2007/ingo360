import { useMutation } from '@tanstack/react-query';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';

import {
  EditCompanyContract,
  type TEditCompanyContract,
} from '../company.contract';
import type { TAddCompanyResponse } from '../company.types';
import { COMPANY_ACCESS_CONTRACT_DEFAULT_VALUE } from '../constants';

export const useEditCompanyMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['companies-edit'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TEditCompanyContract;
    }) => {
      const parsedBody = EditCompanyContract.parse({
        ...COMPANY_ACCESS_CONTRACT_DEFAULT_VALUE,
        ...body,
      });

      const response = await http.patch(`companies/${id}`, {
        json: {
          name: parsedBody.name,
          ims_name: parsedBody.ims_name?.trim() || null,
          active_users_limit: parsedBody.active_users_limit,
          can_primary_sales: parsedBody.can_primary_sales,
          can_secondary_sales: parsedBody.can_secondary_sales,
          can_tertiary_sales: parsedBody.can_tertiary_sales,
          can_visits: parsedBody.can_visits,
          can_market_analysis: parsedBody.can_market_analysis,
          contract_number: parsedBody.contract_number,
          contract_end_date: parsedBody.contract_end_date,
          is_active: parsedBody.is_active,
        },
      });

      return response.json<TAddCompanyResponse>();
    },
    async onSuccess() {
      queryClient.refetchQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies({}),
      });

      onClose();
      toast({ message: 'Компания успешно обновлена' });
    },
    onError: QueryOnError,
  });
};
