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

      const response = await http.patch(`users/${id}`, {
        body: JSON.stringify({
          email: parsedBody.email,
          password: parsedBody.password,
          first_name: parsedBody.first_name,
          last_name: parsedBody.last_name,
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
    async onSuccess(data) {
      const { toast } = await import('sonner');

      onClose();

      // Принудительная инвалидация всех связанных запросов
      await queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getUsers,
      });
      await queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });

      // Дополнительная инвалидация по префиксу
      await queryClient.invalidateQueries({
        predicate: query => {
          return (
            query.queryKey.includes('get-users') ||
            query.queryKey.includes('get-customers') ||
            query.queryKey.includes('users')
          );
        },
      });

      // Принудительное обновление всех связанных запросов
      await queryClient.refetchQueries({
        queryKey: UserQueries.queryKeys.getUsers,
      });
      await queryClient.refetchQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });

      // Дополнительно: обновление кэша вручную
      queryClient.setQueryData(
        UserQueries.queryKeys.getCustomers,
        (oldData: unknown) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((user: unknown) => {
            if (typeof user === 'object' && user !== null && 'id' in user) {
              return user.id === data.id ? { ...user, ...data } : user;
            }
            return user;
          });
        }
      );

      queryClient.setQueryData(
        UserQueries.queryKeys.getUsers,
        (oldData: unknown) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((user: unknown) => {
            if (typeof user === 'object' && user !== null && 'id' in user) {
              return user.id === data.id ? { ...user, ...data } : user;
            }
            return user;
          });
        }
      );

      setTimeout(() => {
        toast.success('Клиент успешно обновлен');
      }, 300);
    },
  });
};
