import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { UserQueries } from '#/entities/user/user.queries';
import type { IUserItem } from '#/entities/user/user.types';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getResponseError } from '#/shared/utils/get-error';

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
      const { toast } = await import('sonner');

      queryClient.setQueryData<IUserItem[]>(
        UserQueries.queryKeys.getCustomers,
        old => {
          if (!old) return [data];
          return old.map(user => (user.id === data.id ? data : user));
        }
      );

      onClose();
      toast.success('Клиент успешно обновлен');
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
