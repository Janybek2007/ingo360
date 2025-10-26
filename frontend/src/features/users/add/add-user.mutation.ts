import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

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
        queryKey: UserQueries.queryKeys.getUsers,
      });

      onClose();
      toast.success('Пользователь успешно добавлен');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
