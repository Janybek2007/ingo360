import { useMutation } from '@tanstack/react-query';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';

import {
  EditCompanyContract,
  type TAddCompanyContract,
} from '../company.contract';
import type { TAddCompanyResponse } from '../company.types';

export const useEditCompanyMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['companies-edit'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TAddCompanyContract;
    }) => {
      const parsedBody = EditCompanyContract.parse(body);

      const response = await http.put(`companies/${id}`, {
        body: JSON.stringify({
          name: parsedBody.name,
          ims_name: parsedBody.ims_name,
          active_users_limit: parsedBody.active_users_limit,
          can_primary_sales: parsedBody.can_primary_sales,
          can_secondary_sales: parsedBody.can_secondary_sales,
          can_tertiary_sales: parsedBody.can_tertiary_sales,
          can_visits: parsedBody.can_visits,
          can_market_analysis: parsedBody.can_market_analysis,
          contract_number: parsedBody.contract_number,
          contract_end_date: parsedBody.contract_end_date,
          is_active: parsedBody.is_active,
        }),
      });

      return response.json<TAddCompanyResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      onClose();

      queryClient.invalidateQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies,
      });

      setTimeout(() => {
        toast.success('Компания успешно обновлена');
      }, 300);
    },
  });
};
