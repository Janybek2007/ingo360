import { useEffect, useState } from 'react';

import type { NotificationMessage, UserAccess } from '../types';

export const useUserAccess = (lastMessage: NotificationMessage | null) => {
  const [access] = useState<UserAccess | null>(null);

  useEffect(() => {
    if (lastMessage) {
    }
  }, [lastMessage]);

  return access;
};
