import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { UserQueries } from '#/entities/user/user.queries';

import { queryClient } from '../libs/react-query';
import { useSocket } from '../libs/socket';

type InvalidateTokenMessage = {
  type: 'token_invalidated';
  message: string;
};

export const useInvalidateToken = () => {
  const [token] = useState(() => Cookies.get('access_token') || null);

  const { lastMessage } = useSocket(`/ws/auth?token=${token}`, Boolean(token));

  useEffect(() => {
    const msg = lastMessage as InvalidateTokenMessage | null;
    if (msg && msg.type === 'token_invalidated') {
      queryClient.setQueryData(UserQueries.queryKeys.getUser, null);
      toast.error(
        msg.message ||
          'Срок действия вашего сеанса истек. Пожалуйста, войдите в систему еще раз.',
        { duration: 2000 }
      );
      Cookies.remove('access_token');
      Cookies.remove('token_type');
    }
  }, [lastMessage]);
};
