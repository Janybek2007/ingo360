import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';

import {
  AddCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';
import type { TAddCustomerResponse } from '../customer.types';

export const useAddCustomerMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['customers-add'],
    mutationFn: async (body: TAddCustomerContract) => {
      const parsedBody = AddCustomerContract.parse(body);
      const response = await http.post('users', {
        body: JSON.stringify(parsedBody),
      });
      return response.json<TAddCustomerResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');
      queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });
      onClose();
      setTimeout(() => {
        toast.success('Клиент успешно добавлен');
      }, 300);
    },
  });
};
