import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const customerAccountsPageRoute: RouteObject = {
  path: routePaths.administrator.customerAccounts,
  lazy: async () =>
    import('./customer-accounts-page.ui').then(module => ({
      Component: module.default,
    })),
};
