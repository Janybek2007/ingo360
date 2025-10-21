import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';

import {
  EditCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';
import type { TAddCustomerResponse } from '../customer.types';

export const useEditCustomerMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['customers-edit'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TAddCustomerContract;
    }) => {
      const parsedBody = EditCustomerContract.parse(body);

      const response = await http.put(`users/${id}`, {
        body: JSON.stringify({
          email: parsedBody.email,
          password: parsedBody.password,
          is_active: parsedBody.is_active,
          is_superuser: parsedBody.is_superuser,
          is_verified: parsedBody.is_verified,
          is_operator: parsedBody.role === 'operator',
          is_admin: parsedBody.role === 'administrator',
          company_id: parsedBody.company_id,
        }),
      });

      return response.json<TAddCustomerResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      onClose();

      queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });

      setTimeout(() => {
        toast.success('Клиент успешно обновлен');
      }, 300);
    },
  });
};
