import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getResponseError } from '#/shared/utils/get-error';

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

      const response = await http.patch(`companies/${id}`, {
        json: {
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
        },
      });

      return response.json<TAddCompanyResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      queryClient.invalidateQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies,
      });

      onClose();
      toast.success('Компания успешно обновлена');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getResponseError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
