import { useEffect } from 'react';

import { UserQueries } from '#/entities/user';
import { toast } from '#/shared/libs/toast/toasts';
import { TokenUtils } from '#/shared/utils/token-utils';

import { queryClient } from '../../libs/react-query';
import { useSocket } from '../../libs/socket';
import { notificationsTypes } from '../constants';
import type { NotificationMessage } from '../types';

export const useNotifications = (isWelcome = false) => {
  const token = TokenUtils.getToken();
  const endpoint = token ? `/ws/notifications?token=${token}` : null;

  const { lastMessage, disconnect, send } =
    useSocket<NotificationMessage | null>(endpoint ?? '', Boolean(endpoint));

  useEffect(() => {
    if (isWelcome) return;

    const message = lastMessage;
    if (!message || !message.type) return;

    if (notificationsTypes.includes(message.type)) {
      queryClient.setQueryData(UserQueries.queryKeys.getUser, null);
      toast({
        duration: 2000,
        message:
          message.message ||
          'Срок действия вашего сеанса истек. Пожалуйста, войдите в систему еще раз.',
        type: 'warning',
      });
      TokenUtils.clearToken();
      disconnect();
    }
  }, [lastMessage, isWelcome, disconnect]);

  return {
    lastMessage,
    disconnect,
    send,
  };
};
