import type { RouteObject } from 'react-router';

import { customerManagementPageRoute } from '../pages/company-management';
import { customerAccountsPageRoute } from '../pages/customer-accounts';
import { ingoAccountsPageRoute } from '../pages/ingo-accounts';

export const administratorLayoutRoute: RouteObject = {
  lazy: async () => {
    const Component = await import('./administrator-layout.ui').then(
      module => module.default
    );
    return { Component };
  },
  children: [
    ingoAccountsPageRoute,
    customerAccountsPageRoute,
    customerManagementPageRoute,
  ],
};
