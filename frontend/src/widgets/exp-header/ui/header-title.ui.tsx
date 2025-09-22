import React, { useMemo } from 'react';
import { useLocation } from 'react-router';

import { headerTitle } from '#/shared/constants/header-title';

export const HeaderTitle: React.FC = React.memo(() => {
  const { pathname } = useLocation();
  const ht = useMemo(() => headerTitle[pathname], [pathname]);
  return (
    <div>
      <h5 className="font-medium text-xl leading-full text-[#211C37]">{ht}</h5>
    </div>
  );
});

HeaderTitle.displayName = '_HeaderTitle_';
