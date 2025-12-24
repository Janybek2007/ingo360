import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';

import {
  AddCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';

export const useAddCustomerMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['customers-add'],
    mutationFn: async (body: TAddCustomerContract) => {
      const parsedBody = AddCustomerContract.parse(body);
      const response = await http.post('users', {
        json: {
          ...parsedBody,
          position: parsedBody.position,
        },
      });
      return response.json();
    },
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });
      onClose();
      toast({
        message: 'Клиент успешно добавлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
