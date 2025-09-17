import React from 'react';
import { useLocation } from 'react-router';

import { useRouter } from '../hooks/use-router';
import { routePaths } from '../router';
import type { SessionRole } from '../types';
import { useSession } from './session.context';
import type { CheckSessionProps } from './types';

const roleRedirects: Record<SessionRole, string> = {
  administrator: routePaths.administrator.ingoAccounts,
  customer: routePaths.customer.home,
  operator: routePaths.operator.dbWork,
};

export const CheckSession: React.FC<CheckSessionProps> = ({
  children,
  userRole,
}) => {
  const { user } = useSession();
  const { pathname } = useLocation();
  const { navigate } = useRouter();

  React.useEffect(() => {
    const isAuthPage = pathname.startsWith('/auth');

    if (user) {
      if (userRole === 'has') {
        const redirectPath = roleRedirects[user.role];
        if (redirectPath && redirectPath !== pathname) {
          navigate(redirectPath, { replace: true });
        }
      } else {
        if (user.role !== userRole) {
          const redirectPath = roleRedirects[user.role];
          if (redirectPath && redirectPath !== pathname) {
            navigate(redirectPath, { replace: true });
          }
        }
      }
    } else if (!isAuthPage) {
      navigate(routePaths.auth.login, { replace: true });
    }
  }, [user, pathname, navigate, userRole]);

  return <>{children}</>;
};
