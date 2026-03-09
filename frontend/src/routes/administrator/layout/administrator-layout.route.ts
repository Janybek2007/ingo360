import type { RouteObject } from 'react-router';

import { profilePageRoute } from '#/routes/profile';

import { customerManagementPageRoute } from '../pages/company-management';
import { customerAccountsPageRoute } from '../pages/customer-accounts';
import { ingoAccountsPageRoute } from '../pages/ingo-accounts';

export const administratorLayoutRoute: RouteObject = {
  lazy: () =>
    import('./administrator-layout.ui').then(module => ({
      Component: module.default,
    })),
  children: [
    ingoAccountsPageRoute,
    customerAccountsPageRoute,
    customerManagementPageRoute,
    profilePageRoute,
  ],
};
