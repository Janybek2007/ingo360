import { useEffect } from 'react';

import { UserQueries } from '#/entities/user';
import { toast } from '#/shared/libs/toast/toast';
import { TokenUtils } from '#/shared/utils/token-utils';

import { queryClient } from '../../libs/react-query';
import { useSocket } from '../../libs/socket';
import type { NotificationMessage } from '../types';

export const useNotifications = (isWelcome = false) => {
  const token = TokenUtils.getToken();
  const endpoint = token ? `/ws/notifications?token=${token}` : null;

  const { lastMessage } = useSocket(endpoint ?? '', Boolean(endpoint));

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
      toast({
        duration: 2000,
        message:
          msg.message ||
          'Срок действия вашего сеанса истек. Пожалуйста, войдите в систему еще раз.',
        type: 'warning',
      });
      TokenUtils.clearToken();
    }
  }, [lastMessage, isWelcome]);

  return {
    lastMessage,
  };
};
