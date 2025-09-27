import React from 'react';
import { useLocation } from 'react-router';

import { useRouter } from '../hooks/use-router';
import { routePaths } from '../router';
import { useSession } from './session.context';
import type { CheckSessionProps } from './types';

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
        if (routePaths.profile !== pathname) {
          navigate(routePaths.profile, { replace: true });
        }
      } else {
        if (user.role !== userRole) {
          if (routePaths.profile !== pathname) {
            navigate(routePaths.profile, { replace: true });
          }
        }
      }
    } else if (!isAuthPage) {
      navigate(routePaths.auth.login, { replace: true });
    }
  }, [user, pathname, navigate, userRole]);

  return <>{children}</>;
};
