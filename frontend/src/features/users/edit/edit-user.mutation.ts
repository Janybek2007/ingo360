import { useMutation } from '@tanstack/react-query';

import { type IUserItem, UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';

import { EditUserContract, type TAddUserContract } from '../users.contracts';

export const useEditUserMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['users-edit'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TAddUserContract;
    }) => {
      const parsedBody = EditUserContract.parse(body);

      const requestBody: Record<string, unknown> = {
        email: parsedBody.email,
        first_name: parsedBody.first_name,
        last_name: parsedBody.last_name,
        is_active: parsedBody.is_active,
        is_operator: parsedBody.role === 'operator',
        is_admin: parsedBody.role === 'administrator',
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
        UserQueries.queryKeys.getAdminOperators({}),
        old => {
          if (!old) return [data];
          return old.map(user => (user.id === data.id ? data : user));
        }
      );

      onClose();
      toast({
        message: 'Пользователь успешно обновлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
