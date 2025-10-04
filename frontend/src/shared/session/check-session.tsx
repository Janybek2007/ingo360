import React from 'react';
import { useLocation } from 'react-router';

import { useRouter } from '../hooks/use-router';
import { roleAccess, routePaths } from '../router';
import type { SessionRole } from '../types';
import { useSession } from './session.context';
import type { CheckSessionProps } from './types';

export const CheckSession: React.FC<CheckSessionProps> = ({ children }) => {
  const { user, isLoading } = useSession();
  const { pathname } = useLocation();
  const { navigate } = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith('/auth');

    if (!user) {
      if (!isAuthPage) {
        navigate(routePaths.auth.login, { replace: true });
      }
      return;
    }

    const allowedPaths = roleAccess[user.role as SessionRole] || [];

    if (!allowedPaths.includes(pathname)) {
      navigate(allowedPaths[0] || routePaths.auth.login, { replace: true });
    }
  }, [user, pathname, navigate, isLoading]);

  return <>{isLoading ? null : children}</>;
};
