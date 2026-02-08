import React from 'react';
import { useLocation } from 'react-router';

import { useRouter } from '../../hooks/use-router';
import { roleAccess, routePaths } from '../../router';
import type { SessionRole } from '../../types';
import { useSession } from '../session.context';

export const CheckSession: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user, isLoading } = useSession();
  const { pathname } = useLocation();
  const { navigate } = useRouter();

  const [finish, setFinish] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith('/auth');

    if (!user || !user.is_active) {
      if (!isAuthPage) {
        navigate(routePaths.auth.login, { replace: true });
      }
      setFinish(true);
      return;
    }

    const allowedPaths = roleAccess[user.role as SessionRole] || [];

    if (!allowedPaths.includes(pathname)) {
      navigate(allowedPaths[0] || routePaths.auth.login, { replace: true });
    }

    setFinish(true);
  }, [user, pathname, navigate, isLoading]);

  return <>{isLoading || !finish ? '' : children}</>;
};
