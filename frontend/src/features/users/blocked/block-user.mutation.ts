import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user/user.queries';
import type { GetUserResponse } from '#/entities/user/user.types';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';

export const useBlockUserMutation = (userId: number, onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['block-user', userId],
    mutationFn: async () => {
      const response = await http.patch(`users/${userId}`, {
        json: { is_active: false },
      });
      return response.json<GetUserResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      await queryClient.refetchQueries({
        queryKey: UserQueries.queryKeys.getUsers,
      });

      onClose();
      toast.success('Пользователь успешно добавлен');
    },
    onError: QueryOnError,
  });
};
