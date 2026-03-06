import { useEffect, useMemo, useState } from 'react';

import type { GetUserResponse, UserAccess } from '#/entities/user';

import type { NotificationMessage } from '../types';

export const useUserAccess = (
  lastMessage: NotificationMessage | null,
  user: GetUserResponse | undefined
) => {
  const [access, setAccess] = useState<UserAccess>(() => ({
    can_market_analysis: user?.company.can_market_analysis ?? true,
    can_primary_sales: user?.company.can_primary_sales ?? true,
    can_secondary_sales: user?.company.can_secondary_sales ?? true,
    can_tertiary_sales: user?.company.can_tertiary_sales ?? false,
    can_visits: user?.company.can_visits ?? true,
  }));

  const userBasedAccess = useMemo<UserAccess>(() => {
    if (!user?.company) {
      return {
        can_market_analysis: true,
        can_primary_sales: true,
        can_secondary_sales: true,
        can_tertiary_sales: false,
        can_visits: true,
      };
    }
    return {
      can_market_analysis: user.company.can_market_analysis ?? true,
      can_primary_sales: user.company.can_primary_sales ?? true,
      can_secondary_sales: user.company.can_secondary_sales ?? true,
      can_tertiary_sales: user.company.can_tertiary_sales ?? false,
      can_visits: user.company.can_visits ?? true,
    };
  }, [user]);

  useEffect(() => {
    setAccess(userBasedAccess);
  }, [userBasedAccess]);

  useEffect(() => {
    if (!lastMessage || !lastMessage.access_type) return;

    if (lastMessage.type === 'company_access_revoked') {
      const accessTypeMap: Record<string, keyof UserAccess> = {
        primary: 'can_primary_sales',
        secondary: 'can_secondary_sales',
        tertiary: 'can_tertiary_sales',
        visits: 'can_visits',
        market: 'can_market_analysis',
      };

      const accessKey = accessTypeMap[lastMessage.access_type];
      if (accessKey) {
        setAccess(previous => ({ ...previous, [accessKey]: false }));
      }
    }
  }, [lastMessage]);

  return access;
};
