import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';

import { AddUserContract, type TAddUserContract } from '../users.contracts';
import type { TAddUserResponse } from '../users.types';

export const useAddUserMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['users-add'],
    mutationFn: async (body: TAddUserContract) => {
      const parsedBody = AddUserContract.parse(body);

      const response = await http.post('users', {
        json: {
          email: parsedBody.email,
          first_name: parsedBody.first_name,
          last_name: parsedBody.last_name,
          is_operator: parsedBody.role === 'operator',
          is_admin: parsedBody.role === 'administrator',
        },
      });

      return response.json<TAddUserResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      await queryClient.refetchQueries({
        queryKey: UserQueries.queryKeys.getAdminOperators,
      });

      onClose();
      toast.success('Пользователь успешно добавлен');
    },
    onError: QueryOnError,
  });
};
