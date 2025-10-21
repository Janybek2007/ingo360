import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';

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

      return response.json<TAddUserResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      onClose();

      queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getUsers,
      });

      setTimeout(() => {
        toast.success('Пользователь успешно обновлен');
      }, 300);
    },
  });
};
