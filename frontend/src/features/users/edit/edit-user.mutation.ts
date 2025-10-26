import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import { EditUserContract, type TAddUserContract } from '../users.contracts';
import type { TAddUserResponse } from '../users.types';

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

      const response = await http.patch(`users/${id}`, {
        json: {
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
      toast.success('Пользователь успешно обновлен');
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
