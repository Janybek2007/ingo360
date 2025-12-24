import { useMutation } from '@tanstack/react-query';

import { type GetUserResponse, UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';

export const useBlockUserMutation = (userId: number, onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['block-user', userId],
    mutationFn: async ({ is_active }: { is_active: boolean }) => {
      const response = await http.patch(`users/${userId}`, {
        json: { is_active },
      });
      return response.json<GetUserResponse>();
    },
    async onSuccess(data) {
      await queryClient.refetchQueries({
        queryKey: UserQueries.queryKeys.getUsers,
      });

      onClose();
      toast({
        message: `Пользователь ${!data.is_active ? 'заблокирован' : 'разблокирован'} успешно`,
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
