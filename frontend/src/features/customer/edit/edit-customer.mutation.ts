import { useMutation } from '@tanstack/react-query';

import { type IUserItem, UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';

import {
  EditCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';

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

      const requestBody: Record<string, unknown> = {
        email: parsedBody.email,
        first_name: parsedBody.first_name,
        last_name: parsedBody.last_name,
        position: parsedBody.position,
        is_active: parsedBody.is_active,
        is_superuser: parsedBody.is_superuser,
        is_verified: parsedBody.is_verified,
        is_operator: parsedBody.role === 'operator',
        is_admin: parsedBody.role === 'administrator',
        company_id: parsedBody.company_id,
      };

      if (parsedBody.password && parsedBody.password.trim().length > 0) {
        requestBody.password = parsedBody.password;
      }

      const response = await http.patch(`users/${id}`, {
        json: requestBody,
      });

      return response.json<IUserItem>();
    },
    async onSuccess(data) {
      queryClient.setQueryData<IUserItem[]>(
        UserQueries.queryKeys.getCustomers({}),
        old => {
          if (!old) return [data];
          return old.map(user => (user.id === data.id ? data : user));
        }
      );

      onClose();
      toast({
        message: 'Клиент успешно обновлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
