import { useMutation } from '@tanstack/react-query';

import { CompanyQueries } from '#/entities/company';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';

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
      onClose();

      queryClient.invalidateQueries({
        queryKey: CompanyQueries.queryKeys.getCompanies({}),
      });

      toast({
        message: 'Настройки доступа компании успешно обновлены',
      });
    },
    onError: QueryOnError,
  });
};
