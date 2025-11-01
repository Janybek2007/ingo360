import { useEffect, useState } from 'react';

import type { GetUserResponse, UserAccess } from '#/entities/user/user.types';

import type { NotificationMessage } from '../types';

export const useUserAccess = (
  lastMessage: NotificationMessage | null,
  user: GetUserResponse | undefined
) => {
  const [access, setAccess] = useState<UserAccess>({
    can_primary_sales: user?.company?.can_primary_sales ?? false,
    can_secondary_sales: user?.company?.can_secondary_sales ?? false,
    can_tertiary_sales: user?.company?.can_tertiary_sales ?? false,
    can_visits: user?.company?.can_visits ?? false,
    can_market_analysis: user?.company?.can_market_analysis ?? false,
  });

  useEffect(() => {
    if (!lastMessage || !lastMessage.access_type) return;

    if (lastMessage.type === 'company_access_revoked') {
      const foundAccess: Record<string, keyof UserAccess> = {
        primary: 'can_primary_sales',
        secondary: 'can_secondary_sales',
        tertiary: 'can_tertiary_sales',
        visits: 'can_visits',
        market: 'can_market_analysis',
      };

      const key = foundAccess[lastMessage.access_type];
      if (key) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAccess(prev => ({ ...prev, [key]: false }));
      }
    }
  }, [lastMessage]);

  return access;
};
