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

      const response = await http.put(`companies/${id}`, {
        body: JSON.stringify(parsedBody),
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
