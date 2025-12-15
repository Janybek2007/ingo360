import { useMutation } from '@tanstack/react-query';

import { type GetUserResponse, UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';

export const useBlockUserMutation = (userId: number, onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['block-user', userId],
    mutationFn: async ({ is_active }: { is_active: boolean }) => {
      const response = await http.patch(`users/${userId}`, {
        json: { is_active },
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
