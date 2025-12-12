import { useMutation } from '@tanstack/react-query';

import { UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { useRouter } from '#/shared/hooks/use-router';
import { queryClient } from '#/shared/libs/react-query';
import { routePaths } from '#/shared/router';
import { TokenUtils } from '#/shared/utils/token-utils';

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
      const { toast } = await import('sonner');
      toast.success('Вы успешно вышли из аккаунта');
    },
  });
};
