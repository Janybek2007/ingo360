import React, { useMemo } from 'react';
import { useLocation } from 'react-router';

import { headerTitle } from '#/shared/constants/header-title';
import { useSession } from '#/shared/session';

export const HeaderTitle: React.FC = React.memo(() => {
  const { pathname } = useLocation();
  const ht = useMemo(() => headerTitle[pathname], [pathname]);
  const { user } = useSession();

  return (
    <div>
      <h5 className="font-medium text-xl leading-full text-[#211C37]">
        {pathname == '/'
          ? `Добро пожаловать ${user?.first_name || ''} ${user?.last_name || ''}`
          : ht}
      </h5>
    </div>
  );
});

HeaderTitle.displayName = '_HeaderTitle_';
