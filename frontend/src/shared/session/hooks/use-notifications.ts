import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { UserQueries } from '#/entities/user/user.queries';

import { queryClient } from '../../libs/react-query';
import { useSocket } from '../../libs/socket';
import type { NotificationMessage } from '../types';

export const useNotifications = (isWelcome = false) => {
  const [token] = useState(() => Cookies.get('access_token') || null);

  const { lastMessage } = useSocket(
    `/ws/notifications?token=${token}`,
    Boolean(token)
  );

  useEffect(() => {
    if (isWelcome) return;

    const msg = lastMessage as NotificationMessage | null;

    if (!msg || !msg.type) return;

    if (
      [
        'token_invalidated',
        'account_deactivated',
        'company_deactivated',
      ].includes(msg.type)
    ) {
      queryClient.setQueryData(UserQueries.queryKeys.getUser, null);
      toast.error(
        msg.message ||
          'Срок действия вашего сеанса истек. Пожалуйста, войдите в систему еще раз.',
        { duration: 2000 }
      );
      Cookies.remove('access_token');
      Cookies.remove('token_type');
    }
  }, [lastMessage, isWelcome]);

  return {
    lastMessage,
  };
};
