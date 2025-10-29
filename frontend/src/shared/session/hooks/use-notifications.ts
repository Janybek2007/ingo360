import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { UserQueries } from '#/entities/user/user.queries';

import { queryClient } from '../../libs/react-query';
import { useSocket } from '../../libs/socket';

type NotificationMessage = {
  type: 'token_invalidated';
  message: string;
};

export const useNotifications = () => {
  const [token, setToken] = useState(() => Cookies.get('access_token') || null);

  const { lastMessage, disconnect } = useSocket(
    `/ws/notifications?token=${token}`,
    Boolean(token)
  );

  const reconnect = useCallback(() => {
    const newToken = Cookies.get('access_token');
    if (newToken) {
      disconnect();
      setToken(newToken);
    }
  }, [disconnect]);

  useEffect(() => {
    const msg = lastMessage as NotificationMessage | null;
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

  return {
    reconnect,
  };
};
