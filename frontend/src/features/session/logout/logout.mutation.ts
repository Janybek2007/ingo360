import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { useRouter } from '#/shared/hooks/use-router';
import { queryClient } from '#/shared/libs/react-query';
import { routePaths } from '#/shared/router';

export const useLogoutMutation = () => {
  const { navigate } = useRouter();
  return useMutation({
    mutationKey: ['session-logout'],
    mutationFn: async () => {
      const response = await http.post('auth/logout', {});

      if (response.status === 204) {
        Cookies.remove('access_token');
        Cookies.remove('token_type');

        setTimeout(() => {
          queryClient.setQueryData(UserQueries.queryKeys.getUser, null);
          navigate(routePaths.auth.login);
        }, 700);
      }
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');
      toast.success('Вы успешно вышли из аккаунта');
    },
  });
};
