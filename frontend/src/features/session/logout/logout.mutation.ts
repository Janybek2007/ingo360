import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { TokenUtils } from '#/shared/api/token-utils';
import { useRouter } from '#/shared/hooks/use-router';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';
import { routePaths } from '#/shared/router';

export const useLogoutMutation = () => {
  const { navigate } = useRouter();
  return useMutation({
    mutationKey: ['session-logout'],
    mutationFn: async () => {
      const response = await http.post('auth/logout', {});

      if (response.status === 204) {
        TokenUtils.clearToken();

        setTimeout(() => {
          queryClient.setQueryData(UserQueries.queryKeys.getUser, null);
          navigate(routePaths.auth.login);
        }, 200);
      }
    },
    onSuccess: async () => {
      toast({ message: 'Вы успешно вышли из аккаунта' });
    },
    onError: QueryOnError,
  });
};
