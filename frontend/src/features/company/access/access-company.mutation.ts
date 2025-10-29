import { useMutation } from '@tanstack/react-query';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';

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
        json: {
          can_primary_sales: parsedBody.can_primary_sales === 'true',
          can_secondary_sales: parsedBody.can_secondary_sales === 'true',
          can_tertiary_sales: parsedBody.can_tertiary_sales === 'true',
          can_visits: parsedBody.can_visits === 'true',
          can_market_analysis: parsedBody.can_market_analysis === 'true',
        },
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
  });
};
